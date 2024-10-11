import { Router } from "express";
import * as CC from "./cart.controller.js";
import { auth, authorization } from './../../middleware/auth.js';
import { systemRoles } from "../../utils/sysremRoles.js";

const cartRouter = Router();
// cartRouter.get("/", auth(),getCartProducts)
cartRouter.get("/",auth,authorization(systemRoles.user),CC.getCartProducts);
cartRouter.post("/",auth,authorization(systemRoles.user),CC.addToCart);

cartRouter.delete("/",auth,authorization(systemRoles.user),CC.removeAllFromCart);

cartRouter.put("/:id",auth,authorization(systemRoles.user),CC.updateQuantity);

    

export default cartRouter;


