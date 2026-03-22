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
exports.getComapnyProfileCompleteData = exports.getCompanyDataForHome = exports.getComapnyContactsData = exports.getComapnySocialData = exports.getCompanyProfileData = exports.getCompanyPersonalData = exports.getCompanyData = void 0;
const company_service_1 = require("../services/company.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const getCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield company_service_1.companyService.getCompanyData(id);
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Company not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company data retrieved successfully'));
}));
exports.getCompanyData = getCompanyData;
const getCompanyPersonalData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield company_service_1.companyService.getCompanyPersonalData(userId);
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Company profile not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company personal data retrieved successfully'));
}));
exports.getCompanyPersonalData = getCompanyPersonalData;
const getCompanyProfileData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield company_service_1.companyService.getCompanyProfileData(userId);
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Company profile not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company profile retrieved successfully'));
}));
exports.getCompanyProfileData = getCompanyProfileData;
const getComapnySocialData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield company_service_1.companyService.getCompanySocialData(userId);
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Social media links not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Social media links retrieved successfully'));
}));
exports.getComapnySocialData = getComapnySocialData;
const getComapnyContactsData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield company_service_1.companyService.getCompanyContactsData(userId);
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Company contact not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company contact retrieved successfully'));
}));
exports.getComapnyContactsData = getComapnyContactsData;
const getCompanyDataForHome = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_service_1.companyService.getCompanyDataForHome();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company data retrieved successfully'));
}));
exports.getCompanyDataForHome = getCompanyDataForHome;
const getComapnyProfileCompleteData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield company_service_1.companyService.getCompanyProfileCompleteData(userId);
    if (!result) {
        throw new ApiError_1.ApiError(404, "Company profile not found.");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Company profile retrieved successfully'));
}));
exports.getComapnyProfileCompleteData = getComapnyProfileCompleteData;
