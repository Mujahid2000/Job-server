import express from 'express';
const router = express.Router();


import { postJobApplication, postPromotedJobs, getAllPostedData, bookmarkJobPost, getAllUserBookMarkByEmail, getUserAllJobPost, getAllCompanyData, getSingleCompanyData, getSpecificCompanyData } from '../controller/jobapplication.controller';

router.route('/jobPost').post(postJobApplication);

router.route('/PromotedJObs').post(postPromotedJobs)

router.route('/getAllPostedData').get(getAllPostedData)

router.route('/bookMarkPost').post(bookmarkJobPost);

router.route('/getBookMark/:email').get(getAllUserBookMarkByEmail)

router.route('/jobPost/:id').get(getUserAllJobPost);

router.route('/getCompanyData').get(getAllCompanyData);

router.route('/getSingleCompanyData/:id').get(getSingleCompanyData)

router.route('/getSpecificCompanyData/:companyId').get(getSpecificCompanyData);

export default router;