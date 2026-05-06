"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const shortlisted_controller_1 = require("../controller/shortlisted.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const shortlisted_validation_1 = require("../validations/shortlisted.validation");
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
router.route("/postShortListedData").post((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.postShortListedData), shortlisted_controller_1.postShortListedData);
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
router.route("/getShortListedData/:jobId").get((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.getParamsJobId), shortlisted_controller_1.getShortListedData);
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
router.route("/getShortListedCount").get((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.getQueryUserId), shortlisted_controller_1.getShortListedCount);
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
router.route("/getShortListedCandidateDetails").get((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.getQueryUserIdResumeId), shortlisted_controller_1.getShortListedCandidateDetails);
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
router.route('/postSaveCandidateProfile').post((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.postSaveCandidateProfile), shortlisted_controller_1.postSaveCandidateProfile);
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
router.route('/getSavedCandidateProfiles/:userId').get((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.getParamsUserId), shortlisted_controller_1.getSavedCandidateProfiles);
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
router.route('/deleteSavedCandidateProfile/:id').delete((0, validateMiddleware_1.default)(shortlisted_validation_1.shortListedValidation.getParamsId), shortlisted_controller_1.deleteSavedCandidateProfile);
exports.default = router;
