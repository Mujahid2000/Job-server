import shortListedSchema from "../models/ShortListedModel";
import saveCandidateProfileModel from "../models/SaveCandidateProfileSchema";
import { ApiError } from "../utils/ApiError";

const postShortListedData = async (shortListData: any) => {
    const { userId, jobId, resumeId, email, applicantId } = shortListData;

    const findShort = await shortListedSchema.findOne({
        userId,
        jobId,
        resumeId,
        email,
        applicantId,
    });
    if (findShort) {
        throw new ApiError(409, "You already added this candidate");
    }

    const shortData = new shortListedSchema(shortListData);
    return await shortData.save();
};

const getShortListedData = async (jobId: string) => {
    return await shortListedSchema.aggregate([
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
};

const getShortListedCandidateDetails = async (userId: string, resumeId: string) => {
    return await shortListedSchema.aggregate([
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
};

const getShortListedCount = async (userId: string) => {
    return await shortListedSchema.countDocuments({ userId });
};

const postSaveCandidateProfile = async (userId: string, applicantId: string) => {
    const existingProfile = await saveCandidateProfileModel.findOne({ userId, applicantId });
    if (existingProfile) {
        throw new ApiError(409, "Candidate profile already saved");
    }

    const newCandidateProfile = new saveCandidateProfileModel({ userId, applicantId });
    return await newCandidateProfile.save();
};

const getSavedCandidateProfiles = async (userId: string) => {
    return await saveCandidateProfileModel.aggregate([
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
};

const deleteSavedCandidateProfile = async (id: string) => {
    const deleteResult = await saveCandidateProfileModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
        throw new ApiError(404, "Saved candidate profile not found");
    }
    return deleteResult;
};

export const shortListedService = {
    postShortListedData,
    getShortListedData,
    getShortListedCandidateDetails,
    getShortListedCount,
    postSaveCandidateProfile,
    getSavedCandidateProfiles,
    deleteSavedCandidateProfile,
};
