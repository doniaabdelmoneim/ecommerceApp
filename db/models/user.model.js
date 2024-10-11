import mongoose from "mongoose";
import { systemRoles } from "../../src/utils/sysremRoles.js";

const userScehma= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        lowercase:true,
        trim:true,
        minLength:4
    },
    email:{
        type:String,
        required:[true,"email is required"],
        lowercase:true,
        unique:[true,"email must be unique"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    loggedIn:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(systemRoles),
        default:"user"
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product"
            }
    }],
    code:String,
    passwordChangeAt:Date



},{
    versionKey:false,
    timestamps:true
})

const userModel = mongoose.model("user",userScehma)
export default userModel