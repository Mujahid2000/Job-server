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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateList = exports.candidateFavouriteJobList = exports.candidateApplyJobList = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const AppliedDataSchema_1 = __importDefault(require("../models/AppliedDataSchema"));
const BookMarksModel_1 = __importDefault(require("../models/BookMarksModel"));
const ApplicantModels_1 = __importDefault(require("../models/ApplicantModels"));
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const candidateApplyJobList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Validate if userId is a valid string
    if (!userId || typeof userId !== 'string') {
        throw new ApiError_1.ApiError(400, 'Invalid or missing userId');
    }
    try {
        const appliedJobs = yield AppliedDataSchema_1.default.aggregate([
            // Match by userId
            {
                $match: {
                    userId: userId,
                },
            },
            // Lookup job details by converting string jobId to ObjectId
            {
                $lookup: {
                    from: "jobpostingcollections",
                    let: { jobIdStr: "$jobId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$_id",
                                        { $toObjectId: "$$jobIdStr" }
                                    ],
                                },
                            },
                        },
                    ],
                    as: "jobPosting",
                },
            },
            {
                $unwind: {
                    path: "$jobPosting",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Lookup company data based on jobPosting.userId
            {
                $lookup: {
                    from: "companydatas",
                    localField: "jobPosting.userId",
                    foreignField: "userId",
                    as: "companyData",
                },
            },
            {
                $unwind: {
                    path: "$companyData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Set selected fields for response
            {
                $set: {
                    logo: "$companyData.logo",
                    jobTitle: "$jobPosting.title",
                    location: "$jobPosting.location",
                    minSalary: "$jobPosting.minSalary",
                    maxSalary: "$jobPosting.maxSalary",
                    jobType: "$jobPosting.jobType",
                    status: "$jobPosting.status",
                },
            },
            // Final projection
            {
                $project: {
                    logo: 1,
                    jobTitle: 1,
                    location: 1,
                    minSalary: 1,
                    maxSalary: 1,
                    jobType: 1,
                    date: 1,
                    status: 1,
                    jobId: 1,
                },
            },
        ]);
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, appliedJobs, 'Applied jobs fetched successfully'));
    }
    catch (error) {
        console.error('Error fetching candidate applied job list:', error);
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.candidateApplyJobList = candidateApplyJobList;
const candidateFavouriteJobList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    // Basic email format check
    if (!email || !email.includes('@')) {
        throw new ApiError_1.ApiError(400, 'Invalid email address provided.');
    }
    try {
        const favoriteJobs = yield BookMarksModel_1.default.aggregate([
            {
                $match: { email }
            },
            {
                $addFields: {
                    companyIdObj: { $toObjectId: "$companyId" },
                    jobObjId: { $toObjectId: "$jobId" }
                }
            },
            {
                $lookup: {
                    from: "companydatas",
                    localField: "companyIdObj",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "jobpostingcollections",
                    localField: "jobObjId",
                    foreignField: "_id",
                    as: "jobPost"
                }
            },
            {
                $unwind: {
                    path: "$jobPost",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    logo: "$company.logo",
                    jobTitle: "$jobPost.title",
                    location: "$jobPost.location",
                    minSalary: "$jobPost.minSalary",
                    maxSalary: "$jobPost.maxSalary",
                    jobType: "$jobPost.jobType",
                    postedDate: "$jobPost.postedDate",
                    jobStatus: {
                        $cond: {
                            if: { $lt: ["$jobPost.expiryDate", "$$NOW"] },
                            then: "Job Expired",
                            else: "Active"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    email: 1,
                    companyId: 1,
                    jobId: 1,
                    logo: 1,
                    jobTitle: 1,
                    location: 1,
                    minSalary: 1,
                    maxSalary: 1,
                    jobType: 1,
                    postedDate: 1,
                    jobStatus: 1
                }
            }
        ]);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, favoriteJobs, 'Favorite jobs fetched successfully'));
    }
    catch (error) {
        console.error("Error fetching favorite job list:", error);
        throw new ApiError_1.ApiError(500, "Internal server error", [error.message]);
    }
}));
exports.candidateFavouriteJobList = candidateFavouriteJobList;
const candidateList = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidateList = yield ApplicantModels_1.default.aggregate([
            {
                $lookup: {
                    from: "personaldatas",
                    localField: "userId",
                    foreignField: "userId",
                    as: "profiledata",
                },
            },
            {
                $unwind: {
                    path: "$profiledata",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "userId",
                    foreignField: "userId",
                    as: "contact",
                },
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "resumecollections",
                    localField: "userId",
                    foreignField: "userId",
                    as: "resume",
                },
            },
            {
                $set: {
                    education: "$profiledata.education",
                    gender: "$profiledata.gender",
                    location: "$contact.mapLocation",
                    resume_Id: "$resume._id",
                },
            },
            {
                $project: {
                    profilePicture: 1,
                    location: 1,
                    gender: 1,
                    fullName: 1,
                    title: 1,
                    education: 1,
                    experience: 1,
                    resume_Id: 1,
                    userId: 1,
                },
            },
        ]);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, candidateList, 'Candidate list fetched successfully'));
    }
    catch (err) {
        // console.error("Error fetching candidate list:", err);
        throw new ApiError_1.ApiError(500, "Internal Server Error", [err.message]);
    }
}));
exports.candidateList = candidateList;
