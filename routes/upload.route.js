import { uploadFile, uploadText } from '../controllers/upload.controller.js';
import { Upload } from '../middleware/multer.middleware.js';
import { Router } from 'express';



const router = Router();

router.route("/upload/file").post( Upload.single("secretFile"), uploadFile );
router.route("/upload/text").post( uploadText );

export default router;