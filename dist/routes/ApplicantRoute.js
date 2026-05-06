"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const applicant_controller_1 = require("../controller/applicant.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const applicant_validation_1 = require("../validations/applicant.validation");
const jobapplication_validation_1 = require("../validations/jobapplication.validation");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
/**
 * @swagger
 * tags:
 *   name: Applicants
 *   description: Applicant profile and data management
 */
/**
 * @swagger
 * /applicantData/applicant:
 *   post:
 *     summary: Post or update applicant data
 *     tags: [Applicants]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               # Add other properties as needed based on controller
 *     responses:
 *       201:
 *         description: Applicant data saved successfully
 */
router.post('/applicant', upload.single('profilePicture'), (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.postApplicant), applicant_controller_1.postApplicant);
/**
 * @swagger
 * /applicantData/resumes/{email}:
 *   get:
 *     summary: Get resumes by email
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumes fetched successfully
 */
router.get('/resumes/:email', (0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsEmail), applicant_controller_1.getResumesByEmail);
/**
 * @swagger
 * /applicantData/uploadCv:
 *   post:
 *     summary: Upload CV/Resume
 *     tags: [Applicants]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploaded successfully
 */
router.post('/uploadCv', upload.single('file'), (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.uploadCv), applicant_controller_1.uploadCv);
/**
 * @swagger
 * /applicantData/applicant/{email}:
 *   get:
 *     summary: Get applicant data by email
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applicant data found
 */
router.get('/applicant/:email', (0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsEmail), applicant_controller_1.getApplicantByEmail);
/**
 * @swagger
 * /applicantData/personal:
 *   post:
 *     summary: Update personal data
 *     tags: [Applicants]
 *     responses:
 *       200:
 *         description: Personal data updated
 */
router.post('/personal', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.postPersonalData), applicant_controller_1.postPersonalData);
/**
 * @swagger
 * /applicantData/updateNotification/{id}:
 *   patch:
 *     summary: Update notification settings
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification updated
 */
router.patch('/updateNotification/:id', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.updateNotification), applicant_controller_1.updateNotification);
/**
 * @swagger
 * /applicantData/getNotificationData/{userId}:
 *   get:
 *     summary: Get notification data
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification data fetched
 */
router.get('/getNotificationData/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.getParamsUserId), applicant_controller_1.getNotificationData);
/**
 * @swagger
 * /applicantData/updateJobAlerts/{userId}:
 *   patch:
 *     summary: Update job alerts
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job alerts updated
 */
router.patch('/updateJobAlerts/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.updateJobAlerts), applicant_controller_1.updateJobAlerts);
/**
 * @swagger
 * /applicantData/getJobAlertsData/{userId}:
 *   get:
 *     summary: Get job alerts data
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job alerts data fetched
 */
router.get('/getJobAlertsData/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.getParamsUserId), applicant_controller_1.getJobAlertsData);
/**
 * @swagger
 * /applicantData/privacyOnOf/{userId}:
 *   patch:
 *     summary: Update privacy settings
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Privacy updated
 */
router.patch('/privacyOnOf/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.updatePrivacy), applicant_controller_1.updatePrivacy);
/**
 * @swagger
 * /applicantData/getProfilePrivacyData/{userId}:
 *   get:
 *     summary: Get privacy data
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Privacy data fetched
 */
router.get('/getProfilePrivacyData/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.getParamsUserId), applicant_controller_1.getProfilePrivacyData);
/**
 * @swagger
 * /applicantData/updatePassword/{userId}:
 *   patch:
 *     summary: Update password
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.patch('/updatePassword/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.updatePassword), applicant_controller_1.updatePassword);
/**
 * @swagger
 * /applicantData/profileComplete/{userId}:
 *   get:
 *     summary: Check profile completion status
 *     tags: [Applicants]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Completion status fetched
 */
router.get('/profileComplete/:userId', (0, validateMiddleware_1.default)(applicant_validation_1.applicantValidation.getParamsUserId), applicant_controller_1.getProfileComplete);
exports.default = router;
