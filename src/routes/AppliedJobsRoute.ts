import express from 'express';
const router = express.Router();
import { postJobAppliced, getUserJobPostData, getJobDataWithCount, getJobApplicantData, getApplicantDetails } from '../controller/appliedjobs.controller';
import validate from '../middleware/validateMiddleware';
import { appliedJobsValidation } from '../validations/appliedjobs.validation';

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
router.route('/jobAppliedJobPost').post(validate(appliedJobsValidation.postJobAppliced), postJobAppliced);

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
router.route("/getUserJobPostData/:userId").get(validate(appliedJobsValidation.getParamsUserId), getUserJobPostData);

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
router.route('/getJobDataWithJobCount').get(getJobDataWithCount);

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
router.route('/getJobApplicantData/:jobId').get(validate(appliedJobsValidation.getParamsJobId), getJobApplicantData);

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
router.route('/getApplicantDetails').get(validate(appliedJobsValidation.getApplicantDetails), getApplicantDetails);

export default router;