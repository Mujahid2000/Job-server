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
exports.candidateList = exports.candidateFavouriteJobList = exports.candidateApplyJobList = void 0;
const candidate_service_1 = require("../services/candidate.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const candidateApplyJobList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const appliedJobs = yield candidate_service_1.candidateService.candidateApplyJobList(userId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, appliedJobs, 'Applied jobs fetched successfully'));
}));
exports.candidateApplyJobList = candidateApplyJobList;
const candidateFavouriteJobList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const favoriteJobs = yield candidate_service_1.candidateService.candidateFavouriteJobList(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, favoriteJobs, 'Favorite jobs fetched successfully'));
}));
exports.candidateFavouriteJobList = candidateFavouriteJobList;
const candidateList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const candidates = yield candidate_service_1.candidateService.candidateList();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, candidates, 'Candidate list fetched successfully'));
}));
exports.candidateList = candidateList;
