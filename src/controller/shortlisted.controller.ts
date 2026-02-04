import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import shortListedSchema from "../models/ShortListedModel";
import saveCandidateProfileModel from "../models/SaveCandidateProfileSchema";


const postShortListedData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, jobId, resumeId, email, applicantId } = req.body;

        if (!userId || !jobId || !resumeId || !email || !applicantId) {
            return res.status(400).json({ message: "Required fields are missing: userId, jobId, resumeId, email, applicantId" });
        }

        const findShort = await shortListedSchema.findOne({
            userId,
            jobId,
            resumeId,
            email,
            applicantId,
        });
        if (findShort) {
            return res
                .status(200)
                .json({ message: "you already added this candidate" });
        }
        const shortData = new shortListedSchema({
            userId,
            jobId,
            resumeId,
            email,
            applicantId,
        });

        const saveShortListedData = await shortData.save();

        if (saveShortListedData) {
            return res
                .status(201)
                .json({
                    message: "You shortListed this candidate successfully",
                    result: saveShortListedData,
                });
        } else {
            return res.status(500).json({ message: "Failed to save data" });
        }
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
})

const getShortListedData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        const getShortListedData = await shortListedSchema.aggregate([
            {
                $match: {
                    jobId: `${jobId}`,
                },
            },
            {
                $lookup: {
                    from: "applicants",
                    localField: "applicantId",
                    foreignField: "userId",
                    as: "applicantData",
                },
            },
            {
                $unwind: {
                    path: "$applicantData",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
            {
                $unwind: {
                    path: "$result",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
        return res.status(200).json({ data: getShortListedData });
    } catch (error: any) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
})

const getShortListedCandidateDetails = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, resumeId } = req.query;
        if (!userId || !resumeId) {
            return res
                .status(400)
                .json({ message: "userId and resumeId are required" });
        }

        const getApplicantDetails = await shortListedSchema.aggregate([
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
            {
                $unwind: {
                    path: "$applicantCollection",
                    preserveNullAndEmptyArrays: true,
                },
            },
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

        if (!getApplicantDetails || getApplicantDetails.length === 0) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        res.status(200).json({ success: true, applicant: getApplicantDetails[0] });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})


const getShortListedCount = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const shortListedCount = await shortListedSchema.countDocuments({ userId });
        return res.status(200).json({ data: shortListedCount });
    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})

const postSaveCandidateProfile = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, applicantId } = req.body;
        if (!userId || !applicantId) {
            return res.status(400).json({ message: "userId and applicantId are required" });
        }

        // Check if already saved
        const existingProfile = await saveCandidateProfileModel.findOne({ userId, applicantId });
        if (existingProfile) {
            return res.status(200).json({ message: "Candidate profile already saved" });
        }

        const newCandidateProfile = new saveCandidateProfileModel({ userId, applicantId });
        const savedProfile = await newCandidateProfile.save();

        if (savedProfile) {
            return res.status(201).json({
                message: "Candidate profile saved successfully",
                result: savedProfile,
            });
        } else {
            return res.status(500).json({ message: "Failed to save candidate profile" });
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})


const getSavedCandidateProfiles = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    //   console.log(userId)
    try {
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const savedProfiles = await saveCandidateProfileModel.aggregate([
            {
                $match: {
                    userId: `${userId}`,
                },
            },
            {
                $lookup: {
                    from: "applicants",
                    localField: "applicantId",
                    foreignField: "userId",
                    as: "applicantInfo",
                },
            },
            {
                $unwind: {
                    path: "$applicantInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
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

        if (!savedProfiles || savedProfiles.length === 0) {
            return res.status(404).json({ message: "No saved candidate profiles found for this user" });
        }

        return res.status(200).json({ message: "Saved candidate profiles fetched successfully", data: savedProfiles });
    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})

const deleteSavedCandidateProfile = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Profile ID is required" });
        }

        const deleteResult = await saveCandidateProfileModel.deleteOne({ _id: id });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: "Saved candidate profile not found" });
        }

        return res.status(200).json({ message: "Saved candidate profile deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})

export {
    postShortListedData,
    getShortListedData,
    getShortListedCandidateDetails,
    getShortListedCount,
    postSaveCandidateProfile,
    getSavedCandidateProfiles,
    deleteSavedCandidateProfile
}