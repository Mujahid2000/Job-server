"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSavedCandidateProfile = exports.getSavedCandidateProfiles = exports.postSaveCandidateProfile = exports.getShortListedCount = exports.getShortListedCandidateDetails = exports.getShortListedData = exports.postShortListedData = void 0;
const shortlisted_service_1 = require("../services/shortlisted.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const postShortListedData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shortlisted_service_1.shortListedService.postShortListedData(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, "You shortListed this candidate successfully"));
}));
exports.postShortListedData = postShortListedData;
const getShortListedData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    const data = yield shortlisted_service_1.shortListedService.getShortListedData(jobId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, data, "Shortlisted candidates fetched successfully"));
}));
exports.getShortListedData = getShortListedData;
const getShortListedCandidateDetails = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, resumeId } = req.query;
    const applicant = yield shortlisted_service_1.shortListedService.getShortListedCandidateDetails(userId, resumeId);
    if (!applicant || applicant.length === 0) {
        throw new ApiError_1.ApiError(404, "Applicant not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, applicant[0], "Applicant details fetched successfully"));
}));
exports.getShortListedCandidateDetails = getShortListedCandidateDetails;
const getShortListedCount = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    const count = yield shortlisted_service_1.shortListedService.getShortListedCount(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, count, "Shortlisted count fetched successfully"));
}));
exports.getShortListedCount = getShortListedCount;
const postSaveCandidateProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, applicantId } = req.body;
    const result = yield shortlisted_service_1.shortListedService.postSaveCandidateProfile(userId, applicantId);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, "Candidate profile saved successfully"));
}));
exports.postSaveCandidateProfile = postSaveCandidateProfile;
const getSavedCandidateProfiles = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const results = yield shortlisted_service_1.shortListedService.getSavedCandidateProfiles(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, results, "Saved candidate profiles fetched successfully"));
}));
exports.getSavedCandidateProfiles = getSavedCandidateProfiles;
const deleteSavedCandidateProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield shortlisted_service_1.shortListedService.deleteSavedCandidateProfile(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Saved candidate profile deleted successfully"));
}));
exports.deleteSavedCandidateProfile = deleteSavedCandidateProfile;
