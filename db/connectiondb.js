import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.resolve("config/.env")});

const connectiondb=async () =>{
    return await mongoose.connect(process.env.DB_Url_online)
    .then(()=>{
        console.log(`connected to database on ${process.env.DB_URL_online}`)
    }).catch((err)=>{
        console.log("database connection error",err);
    })
}

export default connectiondb