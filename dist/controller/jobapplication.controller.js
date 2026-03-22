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
exports.getSpecificCompanyData = exports.getSingleCompanyData = exports.getAllCompanyData = exports.getUserAllJobPost = exports.getAllUserBookMarkByEmail = exports.bookmarkJobPost = exports.getAllPostedData = exports.postPromotedJobs = exports.postJobApplication = void 0;
const jobapplication_service_1 = require("../services/jobapplication.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const postJobApplication = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savedJobData = yield jobapplication_service_1.jobApplicationService.postJobApplication(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, savedJobData, 'Job posting created successfully'));
}));
exports.postJobApplication = postJobApplication;
const postPromotedJobs = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savePromotedData = yield jobapplication_service_1.jobApplicationService.postPromotedJobs(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, savePromotedData, 'Data inserted successfully'));
}));
exports.postPromotedJobs = postPromotedJobs;
const getAllPostedData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield jobapplication_service_1.jobApplicationService.getAllPostedData();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, application, 'Data retrieved successfully'));
}));
exports.getAllPostedData = getAllPostedData;
const bookmarkJobPost = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savedBookmark = yield jobapplication_service_1.jobApplicationService.bookmarkJobPost(req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, savedBookmark, 'Bookmark Job Post successfully.'));
}));
exports.bookmarkJobPost = bookmarkJobPost;
const getAllUserBookMarkByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const getBookMarkData = yield jobapplication_service_1.jobApplicationService.getAllUserBookMarkByEmail(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, getBookMarkData, 'Data retrieved successfully'));
}));
exports.getAllUserBookMarkByEmail = getAllUserBookMarkByEmail;
const getUserAllJobPost = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const getJobPostedDataById = yield jobapplication_service_1.jobApplicationService.getUserAllJobPost(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, getJobPostedDataById, 'Data retrieved successfully'));
}));
exports.getUserAllJobPost = getUserAllJobPost;
const getAllCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyData = yield jobapplication_service_1.jobApplicationService.getAllCompanyData();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, companyData, 'Company data retrieved successfully'));
}));
exports.getAllCompanyData = getAllCompanyData;
const getSingleCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const findSingleCompanyData = yield jobapplication_service_1.jobApplicationService.getSingleCompanyData(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, findSingleCompanyData, 'Data retrieved successfully'));
}));
exports.getSingleCompanyData = getSingleCompanyData;
const getSpecificCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId } = req.params;
    const results = yield jobapplication_service_1.jobApplicationService.getSpecificCompanyData(companyId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, results, 'Data found'));
}));
exports.getSpecificCompanyData = getSpecificCompanyData;
