import { generalFields } from "../../utils/generalField.js";
import  joi  from 'joi';

export const createProductValidation = {
  body: joi.object({
    title: joi.string().min(3).max(32).required(),
    description: joi.string().min(3),
    category: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    brand: generalFields.id.required(),
    price: joi.number().integer().required(),
    stock: joi.number().integer().required(),
    discount: joi.number().integer().min(1).max(100), 
  }),

  files: joi.object({
    image: joi.array().items(generalFields.file.required()).required(),
    coverImages: joi.array().items(generalFields.file.required()).required(),
  }).required(),
  headers: generalFields.headers.required(),
}




export const updateProductValidation={
    body:joi.object({
      name: joi.string().min(3).max(32)
    }),
    file: generalFields.file,
    headers: generalFields.headers.required(),
}
