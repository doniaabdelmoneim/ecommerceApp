import { Router } from "express";
import * as UC from "./user.controller.js";
import { auth, authorization } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/sysremRoles.js";

const userRouter = Router();

userRouter.get("/",UC.getUsers)

userRouter.post("/signup", UC.signUp);
userRouter.get("/verifyEmail/:token", UC.verifyEmail);
userRouter.get("/refreshToken/:refToken", UC.refreshToken);
userRouter.post("/signin", UC.signIn);
userRouter.post("/logout", auth,authorization(systemRoles.admin,systemRoles.user),UC.logOut);
userRouter.get("/profile",auth,authorization(systemRoles.admin,systemRoles.user),UC.getProfile)
export default userRouter;
