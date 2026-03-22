import express from 'express';
const router = express.Router();
import multer from 'multer';
import {
    postCompanyData,
    postFounderInfo,
    postSocialMediaInfo,
    postContactInfo,
    getContactData
} from '../controller/accountsetup.controller';
import validate from '../middleware/validateMiddleware';
import { accountSetupValidation } from '../validations/accountsetup.validation';
import { jobApplicationValidation } from '../validations/jobapplication.validation';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload an image to Cloudinary and save the URL in MongoDB
/**
 * @swagger
 * tags:
 *   name: Company Account Setup
 *   description: Company-related account setup and information
 */

/**
 * @swagger
 * /companyData/companyInfo:
 *   post:
 *     summary: Post or update company information (Logo and Banner)
 *     tags: [Company Account Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *               banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company info saved successfully
 */
router.post('/companyInfo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(accountSetupValidation.postCompanyData), postCompanyData);

/**
 * @swagger
 * /companyData/founderInfo:
 *   post:
 *     summary: Post founder information
 *     tags: [Company Account Setup]
 *     responses:
 *       200:
 *         description: Founder info saved
 */
router.post('/founderInfo', validate(accountSetupValidation.postFounderInfo), postFounderInfo);

/**
 * @swagger
 * /companyData/socialMediaInfo:
 *   post:
 *     summary: Post social media information
 *     tags: [Company Account Setup]
 *     responses:
 *       200:
 *         description: Social media info saved
 */
router.post('/socialMediaInfo', validate(accountSetupValidation.postSocialMedia), postSocialMediaInfo);

/**
 * @swagger
 * /companyData/contactInfo:
 *   post:
 *     summary: Post contact information
 *     tags: [Company Account Setup]
 *     responses:
 *       200:
 *         description: Contact info saved
 */
router.post('/contactInfo', validate(accountSetupValidation.postContactInfo), postContactInfo);

/**
 * @swagger
 * /companyData/getContactData/{email}:
 *   get:
 *     summary: Get company contact data by email
 *     tags: [Company Account Setup]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact data fetched
 *       404:
 *         description: Not found
 */
router.get('/getContactData/:email', validate(jobApplicationValidation.getParamsEmail), getContactData);

export default router;