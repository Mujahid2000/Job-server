import express from 'express';
const router = express.Router();
import {
  getCompanyPersonalData,
  getCompanyData,
  getCompanyProfileData,
  getComapnySocialData,
  getComapnyContactsData,
  getCompanyDataForHome,
  getComapnyProfileCompleteData
} from '../controller/company.controller';
import validate from '../middleware/validateMiddleware';
import { companyValidation } from '../validations/company.validation';

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
router.route('/companyDataById/:id').get(validate(companyValidation.getParamsId), getCompanyData);

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
router.route('/companyPersonal/:userId').get(validate(companyValidation.getParamsUserId), getCompanyPersonalData);

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
router.route('/companyProfile/:userId').get(validate(companyValidation.getParamsUserId), getCompanyProfileData);

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
router.route('/companySocialLink/:userId').get(validate(companyValidation.getParamsUserId), getComapnySocialData);

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
router.route('/companyContacts/:userId').get(validate(companyValidation.getParamsUserId), getComapnyContactsData);

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
router.route('/getCompanyDataForHome').get(getCompanyDataForHome);

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
router.route('/companyProfileComplete/:userId').get(validate(companyValidation.getParamsUserId), getComapnyProfileCompleteData);


export default router;