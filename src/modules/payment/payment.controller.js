import { asyncHandler } from "../../utils/globalErrorHandling.js";
import productModel from './../../../db/models/product.model.js';
import { AppError } from './../../utils/classError.js';
import couponModel from './../../../db/models/coupon.model.js';
import { stripe } from './../../utils/stripe.js';
import orderModel from "../../../db/models/order.model.js";

// 
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
	  percent_off: discountPercentage,
	  duration: "once",
	});
  
	return coupon.id;
  }
  
  async function createNewCoupon(userId) {
	await couponModel.findOneAndDelete({ userId });
  
	const newCoupon = new couponModel({
	  code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
	  discountPercentage: 10,
	  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
	  userId: userId,
	});
  
	await newCoupon.save();
  
	return newCoupon;
  }
  
// ================================ createCheckoutSession================================================
export const createCheckoutSession = async (req, res, next) => {
	try {
	  const { products, couponCode } = req.body;
  
	  if (!Array.isArray(products) || products.length === 0) {
		return res.status(400).json({ error: "Invalid or empty products array" });
	  }
  
	  let totalAmount = 0;
  
	  const lineItems = await Promise.all(
		products.map(async (product) => {
		  if (!product.name || typeof product.name !== 'string') {
			throw new Error('Invalid product name');
		  }
  
		  if (!product.image || typeof product.image !== 'string') {
			throw new Error('Invalid product image');
		  }
  
		  const stripeProduct = await stripe.products.create({
			name: product.name,
		
			images: [product.image.secure_url],
		  });
  
		  const amount = Math.round(product.price * 100); // Stripe wants you to send in the format of cents
		  totalAmount += amount * product.quantity;
  
		  return {
			price_data: {
			  currency: "LE",
			  product: stripeProduct.id, // Use the Stripe product ID
			  unit_amount: amount,
			},
			quantity: product.quantity || 1,
		  };
		})
	  );
  
	  let coupon = null;
	  if (couponCode) {
		coupon = await couponModel.findOne({ code: couponCode, userId: req.data._id, isActive: true });
		if (coupon) {
		  totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
		}
	  }
  
	  const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
		discounts: coupon
		  ? [
			  {
				coupon: await createStripeCoupon(coupon.discountPercentage),
			  },
			]
		  : [],
		metadata: {
		  userId: req.data._id.toString(),
		  couponCode: couponCode || "",
		  products: JSON.stringify(
			products.map((p) => ({
			  id: p._id,
			  quantity: p.quantity,
			  price: p.price,
			}))
		  ),
		},
	  });
  
	  if (totalAmount >= 20000) {
		await createNewCoupon(req.data._id);
	  }
  
	  res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
	  console.error(`Error creating Stripe product: ${error.message}`);
	  res.status(500).json({ msg: "Error creating Stripe product", err: error.message });
	}
  };
// ================================  checkoutSuccess ================================================


export const checkoutSuccess = async (req, res, next) => {
	try {
	  const { sessionId } = req.body;
	  if (!sessionId) {
		return res.status(400).json({ success: false, message: "Session ID is required" });
	  }
  
	  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
	  if (session.payment_status !== "paid") {
		return res.status(400).json({ success: false, message: "Payment not successful" });
	  }
  
	  if (session.metadata.couponCode) {
		const coupon = await couponModel.findOne({ code: session.metadata.couponCode, userId: session.metadata.userId });
		if (coupon) {
		  await coupon.updateOne({ isActive: false });
		} else {
		  console.log(`Coupon not found: ${session.metadata.couponCode}`);
		}
	  }
  
	  const products = JSON.parse(session.metadata.products);
	  const newOrder = new orderModel({
		user: session.metadata.userId,
		products: products.map((product) => ({
		  product: product.id,
		  quantity: product.quantity,
		  price: product.price,
		})),
		totalAmount: session.amount_total / 100, // convert from cents to dollars,
		stripeSessionId: sessionId,
		transactionId: session.payment_intent, // add transaction ID
	  });
  
	  await newOrder.save();
  
	  res.status(200).json({
		success: true,
		message: "Payment successful, order created, and coupon deactivated if used.",
		orderId: newOrder._id,
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ success: false, message: "Error processing payment" });
	}
  };
  