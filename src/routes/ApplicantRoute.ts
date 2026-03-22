import express from 'express';
const router = express.Router();
import multer from 'multer';
import {
  postApplicant,
  getResumesByEmail,
  uploadCv,
  getApplicantByEmail,
  postPersonalData,
  updateNotification,
  getNotificationData,
  updateJobAlerts,
  getJobAlertsData,
  updatePrivacy,
  getProfilePrivacyData,
  updatePassword,
  getProfileComplete
} from '../controller/applicant.controller';
import validate from '../middleware/validateMiddleware';
import { applicantValidation } from '../validations/applicant.validation';
import { jobApplicationValidation } from '../validations/jobapplication.validation';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post('/applicant', upload.single('profilePicture'), validate(applicantValidation.postApplicant), postApplicant);

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
router.get('/resumes/:email', validate(jobApplicationValidation.getParamsEmail), getResumesByEmail);

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
router.post('/uploadCv', upload.single('file'), validate(applicantValidation.uploadCv), uploadCv);

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
router.get('/applicant/:email', validate(jobApplicationValidation.getParamsEmail), getApplicantByEmail);

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
router.post('/personal', validate(applicantValidation.postPersonalData), postPersonalData);

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
router.patch('/updateNotification/:id', validate(applicantValidation.updateNotification), updateNotification);

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
router.get('/getNotificationData/:userId', validate(applicantValidation.getParamsUserId), getNotificationData);

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
router.patch('/updateJobAlerts/:userId', validate(applicantValidation.updateJobAlerts), updateJobAlerts);

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
router.get('/getJobAlertsData/:userId', validate(applicantValidation.getParamsUserId), getJobAlertsData);

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
router.patch('/privacyOnOf/:userId', validate(applicantValidation.updatePrivacy), updatePrivacy);

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
router.get('/getProfilePrivacyData/:userId', validate(applicantValidation.getParamsUserId), getProfilePrivacyData);

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
router.patch('/updatePassword/:userId', validate(applicantValidation.updatePassword), updatePassword);

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
router.get('/profileComplete/:userId', validate(applicantValidation.getParamsUserId), getProfileComplete);

export default router;
