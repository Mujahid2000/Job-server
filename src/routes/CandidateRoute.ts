import express from 'express';
const router = express.Router();
import { candidateApplyJobList, candidateFavouriteJobList, candidateList } from '../controller/candidate.controller';
import validate from '../middleware/validateMiddleware';
import { candidateValidation } from '../validations/candidate.validation';

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate-specific job data and listings
 */

/**
 * @swagger
 * /candidateJobApplyData/candidateApplyJobList/{userId}:
 *   get:
 *     summary: Get list of jobs applied for by candidate
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applied jobs fetched
 */
router.route('/candidateApplyJobList/:userId').get(validate(candidateValidation.getParamsUserId), candidateApplyJobList);

/**
 * @swagger
 * /candidateJobApplyData/candidateFavoriteJobList/{email}:
 *   get:
 *     summary: Get candidate's favorite job list
 *     tags: [Candidates]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite jobs fetched
 */
router.route('/candidateFavoriteJobList/:email').get(validate(candidateValidation.getParamsEmail), candidateFavouriteJobList);

/**
 * @swagger
 * /candidateJobApplyData/candidateList:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     responses:
 *       200:
 *         description: Candidate list fetched
 */
router.route('/candidateList').get(candidateList);

export default router;
