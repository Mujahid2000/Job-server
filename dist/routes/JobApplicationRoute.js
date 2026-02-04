"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jobapplication_controller_1 = require("../controller/jobapplication.controller");
router.route('/jobPost').post(jobapplication_controller_1.postJobApplication);
router.route('/PromotedJObs').post(jobapplication_controller_1.postPromotedJobs);
router.route('/getAllPostedData').get(jobapplication_controller_1.getAllPostedData);
router.route('/bookMarkPost').post(jobapplication_controller_1.bookmarkJobPost);
router.route('/getBookMark/:email').get(jobapplication_controller_1.getAllUserBookMarkByEmail);
router.route('/jobPost/:id').get(jobapplication_controller_1.getUserAllJobPost);
router.route('/getCompanyData').get(jobapplication_controller_1.getAllCompanyData);
router.route('/getSingleCompanyData/:id').get(jobapplication_controller_1.getSingleCompanyData);
router.route('/getSpecificCompanyData/:companyId').get(jobapplication_controller_1.getSpecificCompanyData);
exports.default = router;
