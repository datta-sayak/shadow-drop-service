import fs from 'fs';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/")
    },
    filename: function(req, file, cb){
        cb(null, (Date.now() + '-' + file.originalname).split(" ").join(""));
    }
})


export const fileUpload = multer({storage})