import express from 'express';
const router = express.Router();
import { postShortListedData, getShortListedData, getShortListedCandidateDetails, getShortListedCount, postSaveCandidateProfile, getSavedCandidateProfiles, deleteSavedCandidateProfile } from '../controller/shortlisted.controller'

/**
 * @swagger
 * tags:
 *   name: Shortlisted Candidates
 *   description: Management of shortlisted candidates and saved profiles
 */

/**
 * @swagger
 * /shortList/postShortListedData:
 *   post:
 *     summary: Shortlist a candidate for a job
 *     tags: [Shortlisted Candidates]
 *     responses:
 *       201:
 *         description: Candidate shortlisted
 */
router.route("/postShortListedData").post(postShortListedData);

/**
 * @swagger
 * /shortList/getShortListedData/{jobId}:
 *   get:
 *     summary: Get shortlisted candidates for a specific job
 *     tags: [Shortlisted Candidates]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shortlisted candidates fetched
 */
router.route("/getShortListedData/:jobId").get(getShortListedData);

/**
 * @swagger
 * /shortList/getShortListedCount:
 *   get:
 *     summary: Get total count of shortlisted candidates
 *     tags: [Shortlisted Candidates]
 *     responses:
 *       200:
 *         description: Count fetched successfully
 */
router.route("/getShortListedCount").get(getShortListedCount);

/**
 * @swagger
 * /shortList/getShortListedCandidateDetails:
 *   get:
 *     summary: Get detailed info of shortlisted candidates
 *     tags: [Shortlisted Candidates]
 *     responses:
 *       200:
 *         description: Details fetched successfully
 */
router.route("/getShortListedCandidateDetails").get(getShortListedCandidateDetails);

/**
 * @swagger
 * /shortList/postSaveCandidateProfile:
 *   post:
 *     summary: Save a candidate profile
 *     tags: [Shortlisted Candidates]
 *     responses:
 *       201:
 *         description: Profile saved successfully
 */
router.route('/postSaveCandidateProfile').post(postSaveCandidateProfile);

/**
 * @swagger
 * /shortList/getSavedCandidateProfiles/{userId}:
 *   get:
 *     summary: Get saved candidate profiles for a user
 *     tags: [Shortlisted Candidates]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved profiles fetched
 */
router.route('/getSavedCandidateProfiles/:userId').get(getSavedCandidateProfiles);

/**
 * @swagger
 * /shortList/deleteSavedCandidateProfile/{id}:
 *   delete:
 *     summary: Delete a saved candidate profile
 *     tags: [Shortlisted Candidates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted
 */
router.route('/deleteSavedCandidateProfile/:id').delete(deleteSavedCandidateProfile);


export default router;
