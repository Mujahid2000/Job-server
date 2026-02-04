"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const shortlisted_controller_1 = require("../controller/shortlisted.controller");
router.route("/postShortListedData").post(shortlisted_controller_1.postShortListedData);
router.route("/getShortListedData/:jobId").get(shortlisted_controller_1.getShortListedData);
router.route("/getShortListedCount").get(shortlisted_controller_1.getShortListedCount);
router.route("/getShortListedCandidateDetails").get(shortlisted_controller_1.getShortListedCandidateDetails);
router.route('/postSaveCandidateProfile').post(shortlisted_controller_1.postSaveCandidateProfile);
router.route('/getSavedCandidateProfiles/:userId').get(shortlisted_controller_1.getSavedCandidateProfiles);
router.route('/deleteSavedCandidateProfile/:id').delete(shortlisted_controller_1.deleteSavedCandidateProfile);
exports.default = router;
