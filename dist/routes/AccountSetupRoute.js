"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const accountsetup_controller_1 = require("../controller/accountsetup.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const accountsetup_validation_1 = require("../validations/accountsetup.validation");
const jobapplication_validation_1 = require("../validations/jobapplication.validation");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
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
router.post('/companyInfo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), (0, validateMiddleware_1.default)(accountsetup_validation_1.accountSetupValidation.postCompanyData), accountsetup_controller_1.postCompanyData);
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
router.post('/founderInfo', (0, validateMiddleware_1.default)(accountsetup_validation_1.accountSetupValidation.postFounderInfo), accountsetup_controller_1.postFounderInfo);
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
router.post('/socialMediaInfo', (0, validateMiddleware_1.default)(accountsetup_validation_1.accountSetupValidation.postSocialMedia), accountsetup_controller_1.postSocialMediaInfo);
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
router.post('/contactInfo', (0, validateMiddleware_1.default)(accountsetup_validation_1.accountSetupValidation.postContactInfo), accountsetup_controller_1.postContactInfo);
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
router.get('/getContactData/:email', (0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsEmail), accountsetup_controller_1.getContactData);
exports.default = router;
