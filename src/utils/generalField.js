import joi from "joi"
import { Types } from "mongoose"
const validationObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("invalid object _id")
}


export const generalFields={
    email:joi.string().email({tlds:{allow:['com','net']}}).required(),
    // Minimum eight characters, at least one letter and one number
    password:joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
    id: joi.string().custom(validationObjectId),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    }),
    headers: joi.object({
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
        token: joi.string().required()
    }),

}