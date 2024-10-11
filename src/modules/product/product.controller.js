import productModel from "../../../db/models/product.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import { nanoid } from "nanoid";

// ================================  Get All Products =================================================

export const getProducts = asyncHandler(async (req, res, next) => {
    const products =await productModel.find({})
    res.status(200).json({ msg: "done", products })
})

// ================================  Get Featured Products =================================================

export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
const FeaturedProducts = await productModel.find({ isFeatured: true }).lean()
if (!FeaturedProducts) {
    return next(new AppError("featured products not found", 404))
}
res.status(200).json({ msg: "done", FeaturedProducts })
})
// ===================================== Create Product =================================================
export const createProduct =asyncHandler(async (req, res, next) => {
    const { name, description, category, price, image } = req.body
      //upload images
      if (!req.file) {
        return next(new AppError("image is required", 400));
      }
      const customId = nanoid(5);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `product/${customId}`,
        }
      );

      const product = await productModel.create({
        name,
        description,
        category,
        price,
        image: { secure_url, public_id },
        customId
      });
      res.status(201).json({ status: "done", product })

      })

// ===================================== Delete Product =================================================

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError("product not exist", 404));
  }
  await cloudinary.api.delete_resources_by_prefix(`product/${product.customId}`)
  await cloudinary.api.delete_folder(`product/${product.customId}`)
  
//   await cloudinary.api.delete_folder(`product/${product.customId}`);
  
  await productModel.findByIdAndDelete(id);
  res.status(200).json({ status: "done" });
})


// ===================================== Get  Product =================================================

export const getRecommendationProducts = asyncHandler(async (req, res, next) => {
    const products = await productModel.aggregate([
        {
            $sample: { size: 4 },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1,
            },
        },
    ]);

    res.status(200).json({ msg: "done", products });
});


// ===================================== Get Products By Category =================================================

export const getProductsByCategory= asyncHandler(async (req, res, next) => {
	const {category} = req.params;
  const products = await productModel.find({category})
  res.status(200).json({ msg: "done", products });
});


// ===================================== Toggle Featured Product =================================================

export const toggleFeaturedProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError("product not exist", 404));
  }
  product.isFeatured = !product.isFeatured;
  const updatedProduct=await product.save();
  await updateFeaturedProductsCache();
  res.status(200).json({ status: "done", updatedProduct });
})

async function updateFeaturedProductsCache(){
  const featuredproducts=await productModel.find({isFeatured:true}).lean()
  if(!featuredproducts){
    return next(new AppError("featured products not found", 404))
  }
}
