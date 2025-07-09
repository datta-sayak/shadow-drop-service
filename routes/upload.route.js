import { uploadFile, uploadText } from '../controllers/dropservice.controller.js';
import { Upload } from '../middleware/multer.middleware.js';
import { Router } from 'express';


const router = Router();

router.route("/file").post( Upload.single("secretFile"), uploadFile );
router.route("/text").post( uploadText );

export default router;