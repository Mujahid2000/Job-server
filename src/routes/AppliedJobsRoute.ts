import express from 'express';
const router = express.Router();
import { postJobAppliced, getUserJobPostData, getJobDataWithCount, getJobApplicantData, getApplicantDetails } from '../controller/appliedjobs.controller';
// POST /jobAppliedJobPost - Apply for a job
router.route('/jobAppliedJobPost').post(postJobAppliced);

router.route("/getUserJobPostData/:userId").get(getUserJobPostData);

router.route('/getJobDataWithJobCount').get(getJobDataWithCount);

router.route('/getJobApplicantData/:jobId').get(getJobApplicantData);

router.route('/getApplicantDetails').get(getApplicantDetails);

export default router;