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
exports.shortListedService = void 0;
const ShortListedModel_1 = __importDefault(require("../models/ShortListedModel"));
const SaveCandidateProfileSchema_1 = __importDefault(require("../models/SaveCandidateProfileSchema"));
const ApiError_1 = require("../utils/ApiError");
const postShortListedData = (shortListData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, jobId, resumeId, email, applicantId } = shortListData;
    const findShort = yield ShortListedModel_1.default.findOne({
        userId,
        jobId,
        resumeId,
        email,
        applicantId,
    });
    if (findShort) {
        throw new ApiError_1.ApiError(409, "You already added this candidate");
    }
    const shortData = new ShortListedModel_1.default(shortListData);
    return yield shortData.save();
});
const getShortListedData = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ShortListedModel_1.default.aggregate([
        { $match: { jobId: `${jobId}` } },
        {
            $lookup: {
                from: "applicants",
                localField: "applicantId",
                foreignField: "userId",
                as: "applicantData",
            },
        },
        { $unwind: { path: "$applicantData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "resumecollections",
                let: { resumeIdStr: "$resumeId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toString: "$_id" }, "$$resumeIdStr"],
                            },
                        },
                    },
                ],
                as: "result",
            },
        },
        { $unwind: { path: "$result", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                profilePicture: "$applicantData.profilePicture",
                fullName: "$applicantData.fullName",
                education: "$applicantData.education",
                experience: "$applicantData.experience",
                title: "$applicantData.title",
                resumeLink: "$result.resumeUrl",
                resume_Id: { $toString: "$result._id" },
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
                applicantId: 1,
            },
        },
    ]);
});
const getShortListedCandidateDetails = (userId, resumeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ShortListedModel_1.default.aggregate([
        {
            $match: {
                applicantId: userId,
                resumeId: resumeId,
            },
        },
        {
            $lookup: {
                from: "applicants",
                localField: "applicantId",
                foreignField: "userId",
                as: "applicantCollection",
            },
        },
        { $unwind: { path: "$applicantCollection", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "personaldatas",
                localField: "applicantId",
                foreignField: "userId",
                as: "personal",
            },
        },
        { $unwind: { path: "$personal", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "socialmediainfos",
                localField: "applicantId",
                foreignField: "userId",
                as: "socialLinks",
            },
        },
        { $unwind: { path: "$socialLinks", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "contacts",
                localField: "applicantId",
                foreignField: "userId",
                as: "userContact",
            },
        },
        { $unwind: { path: "$userContact", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "jobapplydatas",
                localField: "applicantId",
                foreignField: "userId",
                as: "jobApplyData",
            },
        },
        { $unwind: { path: "$jobApplyData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "resumecollections",
                let: { resumeIdStr: resumeId },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [{ $toString: "$_id" }, "$$resumeIdStr"],
                            },
                        },
                    },
                ],
                as: "resumeData",
            },
        },
        { $unwind: { path: "$resumeData", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                mapLocation: "$userContact.mapLocation",
                phoneNumber: "$userContact.phoneNumber",
                biography: "$personal.biography",
                dateOfBirth: "$personal.dateOfBirth",
                country: "$personal.country",
                experience: "$personal.experience",
                education: "$personal.education",
                gender: "$personal.gender",
                maritalStatus: "$personal.maritalStatus",
                socialLink: "$socialLinks.socialLinks",
                resumeName: "$resumeData.resumeName",
                resumeUrl: "$resumeData.resumeUrl",
                resumeSize: "$resumeData.size",
                resumeId: "$resumeData._id",
                coverLetter: "$jobApplyData.coverLetter",
                ApplyDate: "$jobApplyData.date",
                profilePicture: "$applicantCollection.profilePicture",
                portfolio: "$applicantCollection.portfolio",
                fullName: "$applicantCollection.fullName",
                title: "$applicantCollection.title",
                email: "$applicantCollection.email",
                userId: "$applicantCollection.userId",
            },
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
                userId: 1,
            },
        },
    ]);
});
const getShortListedCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ShortListedModel_1.default.countDocuments({ userId });
});
const postSaveCandidateProfile = (userId, applicantId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProfile = yield SaveCandidateProfileSchema_1.default.findOne({ userId, applicantId });
    if (existingProfile) {
        throw new ApiError_1.ApiError(409, "Candidate profile already saved");
    }
    const newCandidateProfile = new SaveCandidateProfileSchema_1.default({ userId, applicantId });
    return yield newCandidateProfile.save();
});
const getSavedCandidateProfiles = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield SaveCandidateProfileSchema_1.default.aggregate([
        { $match: { userId: `${userId}` } },
        {
            $lookup: {
                from: "applicants",
                localField: "applicantId",
                foreignField: "userId",
                as: "applicantInfo",
            },
        },
        { $unwind: { path: "$applicantInfo", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                fullName: "$applicantInfo.fullName",
                profilePicture: "$applicantInfo.profilePicture",
                title: "$applicantInfo.title",
            },
        },
        {
            $project: {
                fullName: 1,
                profilePicture: 1,
                title: 1,
                applicantId: 1,
            },
        },
    ]);
});
const deleteSavedCandidateProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteResult = yield SaveCandidateProfileSchema_1.default.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
        throw new ApiError_1.ApiError(404, "Saved candidate profile not found");
    }
    return deleteResult;
});
exports.shortListedService = {
    postShortListedData,
    getShortListedData,
    getShortListedCandidateDetails,
    getShortListedCount,
    postSaveCandidateProfile,
    getSavedCandidateProfiles,
    deleteSavedCandidateProfile,
};
