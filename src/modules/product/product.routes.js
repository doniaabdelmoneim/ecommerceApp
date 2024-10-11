import { Router } from "express";
import * as PC from "./product.controller.js";
import { auth, authorization } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multerLocal.js";
import { systemRoles } from "../../utils/sysremRoles.js";

const productRouter = Router();
productRouter.get("/",auth,authorization([systemRoles.admin]),PC.getProducts)
productRouter.get("/featured",auth,authorization(Object.values(systemRoles)),PC.getFeaturedProducts)
productRouter.get("/recommendation",auth,authorization(Object.values(systemRoles)),PC.getRecommendationProducts)
productRouter.get("/category/:category",auth,authorization(Object.values(systemRoles)),PC.getProductsByCategory)

productRouter.post("/",
    multerHost(validExtension.image).single("image"),
    auth,authorization([systemRoles.admin]),
    PC.createProduct)

productRouter.patch("/:id",auth,authorization([systemRoles.admin]),PC.toggleFeaturedProduct)
productRouter.delete("/:id",auth,authorization([systemRoles.admin]),PC.deleteProduct)

export default productRouter;
