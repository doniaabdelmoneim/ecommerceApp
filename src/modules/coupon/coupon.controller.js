import couponModel from "../../../db/models/coupon.model.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";

// ================================  getCoupon ================================================
export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findOne({ userId: req.data._id, isActive: true });
    res.status(200).json(coupon || null )
})


// ================================  validateCoupon ================================================
export const validateCoupon = asyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const coupon = await couponModel.findOne({ code: code, userId: req.data._id, isActive: true });

    if (!coupon) {
        return next(new AppError("Coupon not exist", 404));
        }

    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        return next(new AppError("Couponexpired", 404));
    }

    res.json({
        message: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
    });
})


// ================================  add coupon================================================

export const addCoupon = asyncHandler(async (req, res, next) => {
    const { code, discountPercentage, expirationDate } = req.body;
    const userId = req.data._id;

    const newCoupon = new couponModel({
        userId,
        code,
        discountPercentage,
        expirationDate,
        isActive: true,
    });

    await newCoupon.save();

    res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
})