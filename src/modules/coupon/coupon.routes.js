import { Router } from "express";
import * as CC from "./coupon.controller.js";
import { auth, authorization } from "../../middleware/auth.js";

const couponRouter = Router();


couponRouter.get("/",
    auth,
CC.getCoupon);

couponRouter.post("/validate",
  auth,
  CC.validateCoupon
)


couponRouter.post("/",
  auth,
  CC.addCoupon
)








export default couponRouter;
