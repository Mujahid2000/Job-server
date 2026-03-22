import { Request, Response } from "express";
import { shortListedService } from "../services/shortlisted.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const postShortListedData = asyncHandler(async (req: Request, res: Response) => {
    const result = await shortListedService.postShortListedData(req.body);
    res.status(201).json(
        new ApiResponse(201, result, "You shortListed this candidate successfully")
    );
});

const getShortListedData = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const data = await shortListedService.getShortListedData(jobId as string);
    res.status(200).json(
        new ApiResponse(200, data, "Shortlisted candidates fetched successfully")
    );
});

const getShortListedCandidateDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId, resumeId } = req.query;
    const applicant = await shortListedService.getShortListedCandidateDetails(userId as string, resumeId as string);
    if (!applicant || applicant.length === 0) {
        throw new ApiError(404, "Applicant not found");
    }
    res.status(200).json(
        new ApiResponse(200, applicant[0], "Applicant details fetched successfully")
    );
});

const getShortListedCount = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const count = await shortListedService.getShortListedCount(userId as string);
    res.status(200).json(
        new ApiResponse(200, count, "Shortlisted count fetched successfully")
    );
});

const postSaveCandidateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId, applicantId } = req.body;
    const result = await shortListedService.postSaveCandidateProfile(userId, applicantId);
    res.status(201).json(
        new ApiResponse(201, result, "Candidate profile saved successfully")
    );
});

const getSavedCandidateProfiles = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const results = await shortListedService.getSavedCandidateProfiles(userId as string);
    res.status(200).json(
        new ApiResponse(200, results, "Saved candidate profiles fetched successfully")
    );
});

const deleteSavedCandidateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await shortListedService.deleteSavedCandidateProfile(id as string);
    res.status(200).json(
        new ApiResponse(200, result, "Saved candidate profile deleted successfully")
    );
});

export {
    postShortListedData,
    getShortListedData,
    getShortListedCandidateDetails,
    getShortListedCount,
    postSaveCandidateProfile,
    getSavedCandidateProfiles,
    deleteSavedCandidateProfile
};