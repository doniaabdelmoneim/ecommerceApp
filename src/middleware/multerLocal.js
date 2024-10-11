 
import multer from "multer";
import {  nanoid } from "nanoid";
import { AppError } from "../utils/classError.js";
import path from "path"
import fs from "fs"
export const validExtension={
  image:['image/png','image/jpg','image/jpeg'],
  video:['video/mp4'],
  document:['application/pdf'],
  audio:['audio/mp3']
}

export const multerLocal=(customValidation=["image/png"] , customPath="General")=>{
    //1-destination
    //2-fileName
    const allPath=path.resolve(`uploads/${customPath}`)
    if(!fs.existsSync(allPath)){
        fs.mkdirSync(allPath,{recursive:true})
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          // const allPath=path.resolve(`uploads/${customPath}`)
          cb(null,allPath);
        },
        filename: function (req, file, cb) {
            console.log(file);
          cb(null, nanoid(5)+ file.originalname);
        }
      });
      
      //3-fileFilter
      const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
          return cb(null, true);
        } else {
          cb(new AppError('file not supported',501),false)
        }

      };
            
      //5-upload 
    const upload= multer({ storage, fileFilter })
    return upload;
     
    

}


export const multerHost=(customValidation=[])=>{
  const storage = multer.diskStorage({});
    
     const fileFilter = (req, file, cb) => {
      if (customValidation.includes(file.mimetype)) {
        return cb(null, true);
      } else {
        cb(new AppError('file not supported',501),false)
      }

    };
          
    //5-upload 
  const upload= multer({ storage, fileFilter })
  return upload;
   
  

}
