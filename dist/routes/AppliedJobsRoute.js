"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appliedjobs_controller_1 = require("../controller/appliedjobs.controller");
// POST /jobAppliedJobPost - Apply for a job
router.route('/jobAppliedJobPost').post(appliedjobs_controller_1.postJobAppliced);
router.route("/getUserJobPostData/:userId").get(appliedjobs_controller_1.getUserJobPostData);
router.route('/getJobDataWithJobCount').get(appliedjobs_controller_1.getJobDataWithCount);
router.route('/getJobApplicantData/:jobId').get(appliedjobs_controller_1.getJobApplicantData);
router.route('/getApplicantDetails').get(appliedjobs_controller_1.getApplicantDetails);
exports.default = router;
