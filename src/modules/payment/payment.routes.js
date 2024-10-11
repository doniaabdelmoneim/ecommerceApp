import { Router } from "express";

import { auth, authorization } from './../../middleware/auth.js';
import { systemRoles } from "../../utils/sysremRoles.js";
import *  as PC from "./payment.controller.js";
const paymentRouter = Router();
paymentRouter.post("/create-checkout-session",auth,authorization(systemRoles.user),PC.createCheckoutSession);
paymentRouter.post("/checkout-success",auth,authorization(systemRoles.user),PC.checkoutSuccess);


    

export default paymentRouter;


