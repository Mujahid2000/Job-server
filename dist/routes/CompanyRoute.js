"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const company_controller_1 = require("../controller/company.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const company_validation_1 = require("../validations/company.validation");
/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company profile and information management
 */
/**
 * @swagger
 * /getCompanyData/companyDataById/{id}:
 *   get:
 *     summary: Get company data by ID
 *     tags: [Companies]
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
router.route('/companyDataById/:id').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsId), company_controller_1.getCompanyData);
/**
 * @swagger
 * /getCompanyData/companyPersonal/{userId}:
 *   get:
 *     summary: Get company personal data by user ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company personal data fetched
 */
router.route('/companyPersonal/:userId').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsUserId), company_controller_1.getCompanyPersonalData);
/**
 * @swagger
 * /getCompanyData/companyProfile/{userId}:
 *   get:
 *     summary: Get company profile data by user ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company profile data fetched
 */
router.route('/companyProfile/:userId').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsUserId), company_controller_1.getCompanyProfileData);
/**
 * @swagger
 * /getCompanyData/companySocialLink/{userId}:
 *   get:
 *     summary: Get company social links by user ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company social links fetched
 */
router.route('/companySocialLink/:userId').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsUserId), company_controller_1.getComapnySocialData);
/**
 * @swagger
 * /getCompanyData/companyContacts/{userId}:
 *   get:
 *     summary: Get company contacts by user ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company contacts fetched
 */
router.route('/companyContacts/:userId').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsUserId), company_controller_1.getComapnyContactsData);
/**
 * @swagger
 * /getCompanyData/getCompanyDataForHome:
 *   get:
 *     summary: Get company data for homepage
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Company data for home fetched
 */
router.route('/getCompanyDataForHome').get(company_controller_1.getCompanyDataForHome);
/**
 * @swagger
 * /getCompanyData/companyProfileComplete/{userId}:
 *   get:
 *     summary: Check company profile completion status
 *     tags: [Companies]
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
router.route('/companyProfileComplete/:userId').get((0, validateMiddleware_1.default)(company_validation_1.companyValidation.getParamsUserId), company_controller_1.getComapnyProfileCompleteData);
exports.default = router;
