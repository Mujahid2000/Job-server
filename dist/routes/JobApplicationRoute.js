"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jobapplication_controller_1 = require("../controller/jobapplication.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const jobapplication_validation_1 = require("../validations/jobapplication.validation");
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
router.route('/jobPost').post((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.postJobApplication), jobapplication_controller_1.postJobApplication);
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
router.route('/PromotedJObs').post((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.postPromotedJobs), jobapplication_controller_1.postPromotedJobs);
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
router.route('/getAllPostedData').get(jobapplication_controller_1.getAllPostedData);
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
router.route('/bookMarkPost').post((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.bookmarkJobPost), jobapplication_controller_1.bookmarkJobPost);
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
router.route('/getBookMark/:email').get((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsEmail), jobapplication_controller_1.getAllUserBookMarkByEmail);
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
router.route('/jobPost/:id').get((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsId), jobapplication_controller_1.getUserAllJobPost);
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
router.route('/getCompanyData').get(jobapplication_controller_1.getAllCompanyData);
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
router.route('/getSingleCompanyData/:id').get((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsId), jobapplication_controller_1.getSingleCompanyData);
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
router.route('/getSpecificCompanyData/:companyId').get((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsCompanyId), jobapplication_controller_1.getSpecificCompanyData);
exports.default = router;
