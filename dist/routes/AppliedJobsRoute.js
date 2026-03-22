"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appliedjobs_controller_1 = require("../controller/appliedjobs.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const appliedjobs_validation_1 = require("../validations/appliedjobs.validation");
/**
 * @swagger
 * tags:
 *   name: Applied Jobs
 *   description: Management of job applications submitted by candidates
 */
/**
 * @swagger
 * /appliedJobs/jobAppliedJobPost:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applied Jobs]
 *     responses:
 *       201:
 *         description: Job application submitted
 */
router.route('/jobAppliedJobPost').post((0, validateMiddleware_1.default)(appliedjobs_validation_1.appliedJobsValidation.postJobAppliced), appliedjobs_controller_1.postJobAppliced);
/**
 * @swagger
 * /appliedJobs/getUserJobPostData/{userId}:
 *   get:
 *     summary: Get job application data for a user
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's applications fetched
 */
router.route("/getUserJobPostData/:userId").get((0, validateMiddleware_1.default)(appliedjobs_validation_1.appliedJobsValidation.getParamsUserId), appliedjobs_controller_1.getUserJobPostData);
/**
 * @swagger
 * /appliedJobs/getJobDataWithJobCount:
 *   get:
 *     summary: Get all job data with applicant count
 *     tags: [Applied Jobs]
 *     responses:
 *       200:
 *         description: Data fetched successfully
 */
router.route('/getJobDataWithJobCount').get(appliedjobs_controller_1.getJobDataWithCount);
/**
 * @swagger
 * /appliedJobs/getJobApplicantData/{jobId}:
 *   get:
 *     summary: Get applicant data for a specific job
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applicants fetched for the job
 */
router.route('/getJobApplicantData/:jobId').get((0, validateMiddleware_1.default)(appliedjobs_validation_1.appliedJobsValidation.getParamsJobId), appliedjobs_controller_1.getJobApplicantData);
/**
 * @swagger
 * /appliedJobs/getApplicantDetails:
 *   get:
 *     summary: Get specific applicant details
 *     tags: [Applied Jobs]
 *     responses:
 *       200:
 *         description: Applicant details fetched
 */
router.route('/getApplicantDetails').get((0, validateMiddleware_1.default)(appliedjobs_validation_1.appliedJobsValidation.getApplicantDetails), appliedjobs_controller_1.getApplicantDetails);
exports.default = router;
