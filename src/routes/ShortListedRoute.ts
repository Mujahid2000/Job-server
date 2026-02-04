import express from 'express';
const router = express.Router();
import { postShortListedData, getShortListedData, getShortListedCandidateDetails, getShortListedCount, postSaveCandidateProfile, getSavedCandidateProfiles, deleteSavedCandidateProfile } from '../controller/shortlisted.controller'

router.route("/postShortListedData").post(postShortListedData);

router.route("/getShortListedData/:jobId").get(getShortListedData);

router.route("/getShortListedCount").get(getShortListedCount);

router.route("/getShortListedCandidateDetails").get(getShortListedCandidateDetails);

router.route('/postSaveCandidateProfile').post(postSaveCandidateProfile);

router.route('/getSavedCandidateProfiles/:userId').get(getSavedCandidateProfiles);

router.route('/deleteSavedCandidateProfile/:id').delete(deleteSavedCandidateProfile);


export default router;
