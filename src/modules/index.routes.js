import userRouter from "./user/user.routes.js";
import productRouter from './product/product.routes.js';
import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from './cart/cart.routes.js';
import paymentRouter from "./payment/payment.routes.js";
import analyticsRouter from "./analytics/analytics.routes.js";



export {
    userRouter,
    productRouter,
    cartRouter,
    couponRouter,
    paymentRouter,
    analyticsRouter
}