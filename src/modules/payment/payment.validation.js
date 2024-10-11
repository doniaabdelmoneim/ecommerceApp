
import joi from 'joi';
import { generalFields } from '../../utils/generalField.js';



export const createCart = {
    body: joi.object({
        productId: generalFields.id.required(),
        quantity: joi.number().integer().required(),
    }),
    headers: generalFields.headers.required(),

}

export const removeCart = {
    body: joi.object({
        productId: generalFields.id.required(),
    }),
    headers: generalFields.headers.required(),

}

export const clearCart = {
    headers: generalFields.headers.required(),

}

