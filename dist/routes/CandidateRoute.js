"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const candidate_controller_1 = require("../controller/candidate.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const candidate_validation_1 = require("../validations/candidate.validation");
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
router.route('/candidateApplyJobList/:userId').get((0, validateMiddleware_1.default)(candidate_validation_1.candidateValidation.getParamsUserId), candidate_controller_1.candidateApplyJobList);
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
router.route('/candidateFavoriteJobList/:email').get((0, validateMiddleware_1.default)(candidate_validation_1.candidateValidation.getParamsEmail), candidate_controller_1.candidateFavouriteJobList);
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
router.route('/candidateList').get(candidate_controller_1.candidateList);
exports.default = router;
