import express from 'express';
const router = express.Router();
import { 
  getCompanyPersonalData, 
  getCompanyData, 
  getCompanyProfileData, 
  getComapnySocialData, 
  getComapnyContactsData, 
  getCompanyDataForHome, 
  getComapnyProfileCompleteData } from '../controller/company.controller';

router.route('/companyDataById/:id').get(getCompanyData);

router.route('/companyPersonal/:userId').get(getCompanyPersonalData);

router.route('/companyProfile/:userId').get(getCompanyProfileData);

router.route('/companySocialLink/:userId').get(getComapnySocialData);

router.route('/companyContacts/:userId').get(getComapnyContactsData);

router.route('/getCompanyDataForHome').get(getCompanyDataForHome);

// company profile complete api
router.route('/companyProfileComplete/:userId').get(getComapnyProfileCompleteData);


export default router;