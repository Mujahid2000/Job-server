import express from 'express';
const router = express.Router();
import { tagsController } from '../controller/tag.controller';

// Mock data for demonstration


// Get all tags
router.route('/tagsName').get(tagsController);

export default router;
