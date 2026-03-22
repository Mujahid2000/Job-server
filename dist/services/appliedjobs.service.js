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
exports.appliedJobsService = void 0;
const AppliedDataSchema_1 = __importDefault(require("../models/AppliedDataSchema"));
const JobApplicationModels_1 = __importDefault(require("../models/JobApplicationModels"));
const ApplicantModels_1 = __importDefault(require("../models/ApplicantModels"));
const ApiError_1 = require("../utils/ApiError");
const postJobAppliced = (applicationData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email, jobId, resume_Id, coverLetter } = applicationData;
    const existingApplication = yield AppliedDataSchema_1.default.findOne({ userId, jobId });
    if (existingApplication) {
        throw new ApiError_1.ApiError(409, 'You have already applied for this job.');
    }
    const appliedData = new AppliedDataSchema_1.default({ userId, email, jobId, resume_Id, coverLetter });
    return yield appliedData.save();
});
const getUserJobPostData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
                from: "companydatas",
                localField: "userId",
                foreignField: "userId",
                as: "company"
            }
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        { $set: { logo: "$company.logo" } },
        {
            $lookup: {
                from: "jobapplydatas",
                let: { jobIdStr: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$jobId", "$$jobIdStr"]
                            }
                        }
                    }
                ],
                as: "applications"
            }
        },
        { $addFields: { applicationCount: { $size: "$applications" } } },
        {
            $project: {
                logo: 1,
                title: 1,
                location: 1,
                userId: 1,
                salaryType: 1,
                minSalary: 1,
                maxSalary: 1,
                jobType: 1,
                applicationCount: 1,
                status: 1
            }
        }
    ]);
});
const getJobDataWithCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        { $addFields: { jobIdStr: { $toString: "$_id" } } },
        {
            $lookup: {
                from: "promotedlists",
                localField: "jobIdStr",
                foreignField: "jobId",
                as: "promoted"
            }
        },
        { $unwind: { path: "$promoted", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "companydatas",
                localField: "userId",
                foreignField: "userId",
                as: "company"
            }
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        { $set: { logo: "$company.logo", companyName: "$company.companyName" } },
        {
            $lookup: {
                from: "jobapplydatas",
                let: { jobIdStr: "$jobIdStr" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$jobId", "$$jobIdStr"]
                            }
                        }
                    }
                ],
                as: "applications"
            }
        },
        {
            $addFields: {
                applicationCount: { $size: "$applications" },
                Featured: {
                    $cond: {
                        if: { $ifNull: ["$promoted._id", false] },
                        then: "featured",
                        else: null
                    }
                }
            }
        },
        {
            $project: {
                logo: 1,
                title: 1,
                location: 1,
                userId: 1,
                salaryType: 1,
                minSalary: 1,
                maxSalary: 1,
                jobType: 1,
                applicationCount: 1,
                status: 1,
                companyName: 1,
                tags: 1,
                postedDate: 1,
                Featured: 1
            }
        }
    ]);
});
const getJobApplicantData = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield AppliedDataSchema_1.default.aggregate([
        { $match: { jobId: `${jobId}` } },
        {
            $lookup: {
                from: "applicants",
                localField: "userId",
                foreignField: "userId",
                as: "applicantsLists",
            },
        },
        { $unwind: { path: "$applicantsLists", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "jobpostingcollections",
                let: { jobIdStr: "$jobId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", { $toObjectId: "$$jobIdStr" }],
                            },
                        },
                    },
                ],
                as: "jobDetails",
            },
        },
        { $unwind: { path: "$jobDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "companydatas",
                let: { companyUserId: "$jobDetails.userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$userId", "$$companyUserId"] },
                        },
                    },
                ],
                as: "company",
            },
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "resumecollections",
                let: { resumeIdStr: "$resume_Id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toString: "$_id" }, "$$resumeIdStr"],
                            },
                        },
                    },
                ],
                as: "resumeDetails",
            },
        },
        { $unwind: { path: "$resumeDetails", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                profilePicture: "$applicantsLists.profilePicture",
                experience: "$applicantsLists.experience",
                education: "$applicantsLists.education",
                fullName: "$applicantsLists.fullName",
                title: "$applicantsLists.title",
                resumeLink: "$resumeDetails.resumeUrl",
                resume_Id: { $toString: "$resumeDetails._id" },
                companyUserId: "$jobDetails.userId",
                companyName: "$company.companyName",
            },
        },
        {
            $project: {
                profilePicture: 1,
                experience: 1,
                education: 1,
                fullName: 1,
                title: 1,
                date: 1,
                resumeLink: 1,
                userId: 1,
                resume_Id: 1,
                jobId: 1,
                companyUserId: 1,
                companyName: 1,
            },
        },
    ]);
});
const getApplicantDetails = (userId, resumeId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield ApplicantModels_1.default.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
                from: 'personaldatas',
                localField: 'userId',
                foreignField: 'userId',
                as: 'personal'
            }
        },
        { $unwind: { path: '$personal', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'socialmediainfos',
                localField: 'userId',
                foreignField: 'userId',
                as: 'socialLinks'
            }
        },
        { $unwind: { path: '$socialLinks', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'contacts',
                localField: 'userId',
                foreignField: 'userId',
                as: 'userContact'
            }
        },
        { $unwind: { path: '$userContact', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'jobapplydatas',
                localField: 'userId',
                foreignField: 'userId',
                as: 'jobApplyData'
            }
        },
        { $unwind: { path: '$jobApplyData', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'resumecollections',
                let: { resumeIdStr: resumeId },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toString: '$_id' }, '$$resumeIdStr']
                            }
                        }
                    }
                ],
                as: 'userResume'
            }
        },
        { $unwind: { path: '$userResume', preserveNullAndEmptyArrays: true } },
        {
            $set: {
                mapLocation: '$userContact.mapLocation',
                phoneNumber: '$userContact.phoneNumber',
                biography: '$personal.biography',
                dateOfBirth: '$personal.dateOfBirth',
                country: '$personal.country',
                experience: '$personal.experience',
                education: '$personal.education',
                gender: '$personal.gender',
                maritalStatus: '$personal.maritalStatus',
                socialLink: '$socialLinks.socialLinks',
                resumeName: '$userResume.resumeName',
                resumeUrl: '$userResume.resumeUrl',
                resumeSize: '$userResume.size',
                resumeId: '$userResume._id',
                coverLetter: '$jobApplyData.coverLetter',
                ApplyDate: '$jobApplyData.date'
            }
        },
        {
            $project: {
                mapLocation: 1,
                phoneNumber: 1,
                email: 1,
                biography: 1,
                dateOfBirth: 1,
                country: 1,
                experience: 1,
                education: 1,
                gender: 1,
                maritalStatus: 1,
                socialLink: 1,
                resumeName: 1,
                resumeUrl: 1,
                resumeSize: 1,
                coverLetter: 1,
                ApplyDate: 1,
                profilePicture: 1,
                portfolio: 1,
                fullName: 1,
                title: 1,
                resumeId: 1,
                userId: 1
            }
        }
    ]);
    return results[0] || null;
});
exports.appliedJobsService = {
    postJobAppliced,
    getUserJobPostData,
    getJobDataWithCount,
    getJobApplicantData,
    getApplicantDetails,
};
