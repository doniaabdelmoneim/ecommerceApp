import joi from "joi"
import { mongoose } from 'mongoose';
import { systemRoles } from "../../utils/sysremRoles.js";
export const signUpValidation={
    body: joi.object({
        name:joi.string().min(3).max(30).alphanum().messages({
            "string.min":"name must be at least 3 characters",
            "string.max":"name must be at most 30 characters",
            "string.alphanum":"name must contain only letters and numbers",
            "any.required":"name is required"
        }).required(),
        email:joi.string().email({tlds:{allow:["com","net"]}}).messages({
            "string.email":"email must be a valid email",
             "string.pattern.base":"email must contain @ and .com or .net",
             "any.required":"email is required"
        }).required(),
    // Minimum eight characters, at least one letter and one number:
        password:joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).messages({
            "string.pattern.base":"password must contain at least one letter and one number and at least 8 characters",
            "any.required":"password is required",
        }).required(),
        confirmPassword :joi.string().valid(joi.ref('password')).messages({
            "any.only":"passwords don't match",
        })
    })
}

const objectIdValidation=(value,helper)=>{
    return mongoose.Types.objectId.isValid(value) ?true :helper.message('invalid id')
    
}
export const loginValidation= {
    body:joi.object({
        email:joi.string().email().required(),
        password:joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
        id:joi.string().custom(objectIdValidation).required(),
    }),
    Headers:joi.object({
        accept:joi.string(),
        "content-type":joi.string(),
        "user-agent":joi.string(),
        'cache-control':joi.string(),
        'postman-token':joi.string(),
        'content-length':joi.string(),
        'accept-encoding':joi.string(),
        host:joi.string(),
        connection:joi.string(),
        token:joi.string().required()
    })
}

