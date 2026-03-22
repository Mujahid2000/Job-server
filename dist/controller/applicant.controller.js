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
exports.getProfileComplete = exports.updatePassword = exports.getProfilePrivacyData = exports.updatePrivacy = exports.getJobAlertsData = exports.updateJobAlerts = exports.getNotificationData = exports.updateNotification = exports.postPersonalData = exports.getApplicantByEmail = exports.uploadCv = exports.getResumesByEmail = exports.postApplicant = void 0;
const applicant_service_1 = require("../services/applicant.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const postApplicant = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'Profile picture is required');
    }
    const applicant = yield applicant_service_1.applicantService.postApplicant(req.body, req.file);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, applicant, 'Applicant created successfully'));
}));
exports.postApplicant = postApplicant;
const getResumesByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const resumes = yield applicant_service_1.applicantService.getResumesByEmail(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, resumes, 'Resume data fetched successfully'));
}));
exports.getResumesByEmail = getResumesByEmail;
const uploadCv = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new ApiError_1.ApiError(400, 'No resume file provided');
    }
    const resume = yield applicant_service_1.applicantService.uploadCv(req.body, req.file);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, resume, 'CV/Resume uploaded successfully'));
}));
exports.uploadCv = uploadCv;
const getApplicantByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicant = yield applicant_service_1.applicantService.getApplicantByEmail(req.params.email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, applicant, 'Applicant found'));
}));
exports.getApplicantByEmail = getApplicantByEmail;
const postPersonalData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield applicant_service_1.applicantService.postPersonalData(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, data, 'Personal data inserted successfully'));
}));
exports.postPersonalData = postPersonalData;
const updateNotification = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicant_service_1.applicantService.updateNotification(req.params.id, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Notification updated successfully'));
}));
exports.updateNotification = updateNotification;
const getNotificationData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicant_service_1.applicantService.getNotificationData(req.params.userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Notification data retrieved successfully'));
}));
exports.getNotificationData = getNotificationData;
const updateJobAlerts = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicant_service_1.applicantService.updateJobAlerts(req.params.userId, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Job alerts updated successfully'));
}));
exports.updateJobAlerts = updateJobAlerts;
const getJobAlertsData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield applicant_service_1.applicantService.getJobAlertsData(req.params.userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, data, 'Job alerts data retrieved successfully'));
}));
exports.getJobAlertsData = getJobAlertsData;
const updatePrivacy = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicant_service_1.applicantService.updatePrivacy(req.params.userId, req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Privacy mode updated successfully'));
}));
exports.updatePrivacy = updatePrivacy;
const getProfilePrivacyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield applicant_service_1.applicantService.getProfilePrivacyData(req.params.userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, data, 'Privacy data retrieved successfully'));
}));
exports.getProfilePrivacyData = getProfilePrivacyData;
const updatePassword = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const result = yield applicant_service_1.applicantService.updatePassword(req.params.userId, currentPassword, newPassword);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Password updated successfully'));
}));
exports.updatePassword = updatePassword;
const getProfileComplete = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield applicant_service_1.applicantService.getProfileComplete(req.params.userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, result.message));
}));
exports.getProfileComplete = getProfileComplete;
