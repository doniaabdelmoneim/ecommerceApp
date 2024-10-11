import { asyncHandler } from "../../utils/globalErrorHandling.js";
import productModel from './../../../db/models/product.model.js';
import { AppError } from './../../utils/classError.js';


// ================================  get Cart Products ================================================
export const getCartProducts = asyncHandler(async (req, res, next) => {

    const user = req.data
    const products = await productModel.find({ _id: { $in: user.cartItems } });
    // add quantity for each product
    const cartItems = products.map((product) => {
        const item = user.cartItems.find((cartItem) => cartItem.id === product.id);
        return { ...product.toJSON(), quantity: item.quantity };
    });
 res.status(200).json({ status: "done", cartItems });

})
// ================================  addToCart ================================================
export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId} = req.body
    const user = req.data
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push(productId);
    }
    await user.save();
    res.status(201).json(user.cartItems);

})




// ================================  removeAllFromCart ================================================
export const removeAllFromCart = async (req, res) => {
		const { productId } = req.body;
        const user = req.data
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
    res.status(201).json(user.cartItems)

};

// ================================  updateQuantity ================================================

export const updateQuantity = async (req, res) => {
		const { id: productId } = req.params;
		const { quantity } = req.body;
        const user = req.data
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();

				return   res.status(201).json("done",user.cartItems)

			}

			existingItem.quantity = quantity;
			await user.save();
            res.status(201).json(user.cartItems)
		} else {
            return next(new AppError("product not exist", 404));
		}
};



