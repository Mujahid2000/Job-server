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
exports.getApplicantDetails = exports.getJobApplicantData = exports.getJobDataWithCount = exports.getUserJobPostData = exports.postJobAppliced = void 0;
const appliedjobs_service_1 = require("../services/appliedjobs.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const postJobAppliced = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savedApplication = yield appliedjobs_service_1.appliedJobsService.postJobAppliced(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, savedApplication, 'Job application submitted successfully.'));
}));
exports.postJobAppliced = postJobAppliced;
const getUserJobPostData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const results = yield appliedjobs_service_1.appliedJobsService.getUserJobPostData(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, results, 'Applications fetched successfully'));
}));
exports.getUserJobPostData = getUserJobPostData;
const getJobDataWithCount = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobData = yield appliedjobs_service_1.appliedJobsService.getJobDataWithCount();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, jobData, 'Job data with count fetched successfully'));
}));
exports.getJobDataWithCount = getJobDataWithCount;
const getJobApplicantData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    const data = yield appliedjobs_service_1.appliedJobsService.getJobApplicantData(jobId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, data, 'Job applicant data fetched successfully'));
}));
exports.getJobApplicantData = getJobApplicantData;
const getApplicantDetails = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, resumeId } = req.query;
    const applicant = yield appliedjobs_service_1.appliedJobsService.getApplicantDetails(userId, resumeId);
    if (!applicant) {
        throw new ApiError_1.ApiError(404, 'Applicant not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, applicant, 'Applicant details fetched successfully'));
}));
exports.getApplicantDetails = getApplicantDetails;
