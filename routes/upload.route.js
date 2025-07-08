import { uploadFile } from '../controllers/upload.controller.js';
import { fileUpload } from '../middleware/multer.middleware.js';
import { Router } from 'express';



const router = Router();

router.route("/upload/file").post( fileUpload.single("secretFile"), uploadFile );


export default router;