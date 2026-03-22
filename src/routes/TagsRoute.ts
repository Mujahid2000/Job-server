import express from 'express';
const router = express.Router();
import { postTag, getTags } from '../controller/tag.controller';
import validate from '../middleware/validateMiddleware';
import { tagValidation } from '../validations/tag.validation';

// Mock data for demonstration


/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Management of job tags
 */

/**
 * @swagger
 * /tags/postTags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     responses:
 *       201:
 *         description: Tag created successfully
 */
router.post('/postTags', validate(tagValidation.postTag), postTag);

/**
 * @swagger
 * /tags/getTags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Tags fetched
 */
router.get('/getTags', getTags);

export default router;
