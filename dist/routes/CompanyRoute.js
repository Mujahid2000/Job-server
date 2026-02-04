"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const company_controller_1 = require("../controller/company.controller");
router.route('/companyDataById/:id').get(company_controller_1.getCompanyData);
router.route('/companyPersonal/:userId').get(company_controller_1.getCompanyPersonalData);
router.route('/companyProfile/:userId').get(company_controller_1.getCompanyProfileData);
router.route('/companySocialLink/:userId').get(company_controller_1.getComapnySocialData);
router.route('/companyContacts/:userId').get(company_controller_1.getComapnyContactsData);
router.route('/getCompanyDataForHome').get(company_controller_1.getCompanyDataForHome);
// company profile complete api
router.route('/companyProfileComplete/:userId').get(company_controller_1.getComapnyProfileCompleteData);
exports.default = router;
