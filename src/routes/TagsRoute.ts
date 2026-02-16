import express from 'express';
const router = express.Router();
import { tagsController } from '../controller/tag.controller';

// Mock data for demonstration


/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Job tags management
 */

/**
 * @swagger
 * /tags/tagsName:
 *   get:
 *     summary: Get all tag names
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Tags fetched successfully
 */
router.route('/tagsName').get(tagsController);

export default router;
