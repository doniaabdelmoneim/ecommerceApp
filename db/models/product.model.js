import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: [3, "name must be at least 3 characters"],
        maxLength: [32, "name must be at most 32 characters"],
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    price: {
        type: Number,
        min:0,
        required: [true, "price is required"],
    },
    image: {
        secure_url: String,
        public_id: String,
    },
    customId: String,
    category: {
        type: String,
        required: [true, "category is required"],
    },
    isFeatured:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true,
    versionKey:false

})

const productModel = mongoose.model("product",productSchema)
export default productModel;