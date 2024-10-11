import userModel from "../../../db/models/user.model.js"
import bcrypt from "bcrypt"
import  jwt from 'jsonwebtoken';
import { sendEmail } from "../../service/sendEmail.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import cookieParser from 'cookie-parser';

// ===================================== Get all users =============================================
export const getUsers=async (req,res,next)=>{
    const users = await userModel.find()
    res.status(200).json({msg:"done",users})
};

// ===================================== Sign Up =================================================

export const signUp=asyncHandler(async (req,res,next)=>{
    const {name,email,password ,confirmPassword}=req.body  
    const userExist = await userModel.findOne({email:email.toLowerCase()})
    userExist && next(new AppError("user already exist",409))
    // token for confirming email with expire time
    const token=jwt.sign({ email },process.env.signatureKey,{ expiresIn: 6 })
    const link=`${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
  // Store the token in cookie
  res.cookie('token', token, {    
     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,
    sameSite: 'strict' }); // expire in 6 minutes
    // link if i missed or expire link time  (refresh token)
    const refToken=jwt.sign({ email },"generateTokenSecretRefresh")
    const refLink=`${req.protocol}://${req.headers.host}/users/refreshToken/${refToken}`

    const checkSendEmail= await sendEmail(email,"Verify Email",`<a href=${link}>confirm your email</a> <br>
    <a href=${refLink}>Click here to resend the link</a>`)
    if(! checkSendEmail){
        return next(new AppError("email not sent please call tech team", 424))
    } 
    const hash =bcrypt.hashSync(password,Number(process.env.saltRound))
   const newUser=await userModel.create({name,email,password:hash })

   newUser? res.status(200).json({msg:"done", user:newUser}) : next(new AppError("user not created",500))

    
})
// ===================================== Verify Email =================================================

export const verifyEmail=asyncHandler(async (req,res,next)=>{
    const {token}=req.params
    const decoded = jwt.verify(token,process.env.signatureKey)
    if(! decoded.email){
        return next(new AppError("invalid token",498)) 
    } 
    const user = await userModel.findOneAndUpdate({email:decoded.email ,confirmed:false},{confirmed:true},{new:true})
    user ? res.status(200).json({msg:"done", user:user}) : next(new AppError("user not found or already confirmed",409))
})

// ===================================== Refresh Token =================================================

export const refreshToken=asyncHandler(async (req,res,next)=>{
    const {refToken}=req.params
    const decoded = jwt.verify(refToken,process.env.signatureKeyRefresh)
    if(!decoded?.email){
        return next(new AppError("invalid token",498)) 
    } 
    const user = await userModel.findOne({email:decoded.email ,confirmed:true})
    if(user){
        return next (new AppError ("user not exist or already confirmed",400))
    }
    const token=jwt.sign({email:decoded.email },process.env.signatureKey,{ expiresIn: 60*2 })
    const link=`${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`
    await sendEmail(decoded.email,"ReToken",`<a href=${link}>confirm your email</a>`)
    res.status(200).json({msg:"done"}) 
})



// ===================================== Sign In =================================================

export const signIn=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body
    const user = await userModel.findOne({email , confirmed:true})

    if(! user || !bcrypt.compareSync(password,user.password) ) {
        return next (new AppError("email not exist or not confirmed email or password incorrect",401))
    }
    const token =jwt.sign({email ,role:user.role},process.env.signatureKey)
    
    await userModel.updateOne({email},{loggedIn:true})
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
    res.status(200).json({msg:"success",token})


})


// ===================================== log out =================================================

export const logOut=asyncHandler(async (req,res,next)=>{
    await userModel.updateOne({email:req.data.email},{loggedIn:false})
    res.clearCookie('token', { path: '/' })
    res.status(200).json({msg:"Logged out successfully"})

})
// ===================================== Get Profile =================================================

export const getProfile=asyncHandler(async (req,res,next)=>{
    console.log(req.data)
    const user= await userModel.findOne({email:req.data.email})
    res.status(200).json({msg:"success",user})

})
