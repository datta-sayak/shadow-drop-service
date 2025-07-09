import { Router } from 'express';
import { download } from '../controllers/dropservice.controller.js';

const router = Router();

router.route("/:shortUrl").get( download );

export default router;