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
exports.getContactData = exports.postSocialMediaInfo = exports.postContactInfo = exports.postFounderInfo = exports.postCompanyData = void 0;
const accountsetup_service_1 = require("../services/accountsetup.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const postCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || !files.logo || !files.banner) {
        throw new ApiError_1.ApiError(400, 'Logo and Banner are required');
    }
    const result = yield accountsetup_service_1.accountSetupService.postCompanyData(req.body, files);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'Company data saved successfully'));
}));
exports.postCompanyData = postCompanyData;
const postFounderInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accountsetup_service_1.accountSetupService.postFounderInfo(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'Founder info saved successfully'));
}));
exports.postFounderInfo = postFounderInfo;
const postContactInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accountsetup_service_1.accountSetupService.postContactInfo(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'Contact info saved successfully'));
}));
exports.postContactInfo = postContactInfo;
const postSocialMediaInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accountsetup_service_1.accountSetupService.postSocialMediaInfo(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'Social media links saved successfully'));
}));
exports.postSocialMediaInfo = postSocialMediaInfo;
const getContactData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield accountsetup_service_1.accountSetupService.getContactData(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Contact data retrieved successfully'));
}));
exports.getContactData = getContactData;
