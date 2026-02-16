import express from 'express';
const router = express.Router();


import { postJobApplication, postPromotedJobs, getAllPostedData, bookmarkJobPost, getAllUserBookMarkByEmail, getUserAllJobPost, getAllCompanyData, getSingleCompanyData, getSpecificCompanyData } from '../controller/jobapplication.controller';

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job applications, postings, and company data
 */

/**
 * @swagger
 * /jobs/jobPost:
 *   post:
 *     summary: Create a new job post
 *     tags: [Jobs]
 *     responses:
 *       201:
 *         description: Job posted successfully
 */
router.route('/jobPost').post(postJobApplication);

/**
 * @swagger
 * /jobs/PromotedJObs:
 *   post:
 *     summary: Create a promoted job post
 *     tags: [Jobs]
 *     responses:
 *       201:
 *         description: Promoted job created
 */
router.route('/PromotedJObs').post(postPromotedJobs)

/**
 * @swagger
 * /jobs/getAllPostedData:
 *   get:
 *     summary: Get all posted job data
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Data fetched successfully
 */
router.route('/getAllPostedData').get(getAllPostedData)

/**
 * @swagger
 * /jobs/bookMarkPost:
 *   post:
 *     summary: Bookmark a job post
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Post bookmarked
 */
router.route('/bookMarkPost').post(bookmarkJobPost);

/**
 * @swagger
 * /jobs/getBookMark/{email}:
 *   get:
 *     summary: Get all bookmarked posts for a user
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmarks fetched successfully
 */
router.route('/getBookMark/:email').get(getAllUserBookMarkByEmail)

/**
 * @swagger
 * /jobs/jobPost/{id}:
 *   get:
 *     summary: Get all job posts by user ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's job posts fetched
 */
router.route('/jobPost/:id').get(getUserAllJobPost);

/**
 * @swagger
 * /jobs/getCompanyData:
 *   get:
 *     summary: Get all company data
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Company data fetched
 */
router.route('/getCompanyData').get(getAllCompanyData);

/**
 * @swagger
 * /jobs/getSingleCompanyData/{id}:
 *   get:
 *     summary: Get single company data by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company data fetched
 */
router.route('/getSingleCompanyData/:id').get(getSingleCompanyData)

/**
 * @swagger
 * /jobs/getSpecificCompanyData/{companyId}:
 *   get:
 *     summary: Get specific company data by company ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specific company data fetched
 */
router.route('/getSpecificCompanyData/:companyId').get(getSpecificCompanyData);

export default router;