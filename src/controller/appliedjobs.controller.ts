import { Request, Response } from "express";
import { appliedJobsService } from "../services/appliedjobs.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const postJobAppliced = asyncHandler(async (req: Request, res: Response) => {
    const savedApplication = await appliedJobsService.postJobAppliced(req.body);
    res.status(201).json(
        new ApiResponse(201, savedApplication, 'Job application submitted successfully.')
    );
});

const getUserJobPostData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const results = await appliedJobsService.getUserJobPostData(userId as string);
    res.status(200).json(
        new ApiResponse(200, results, 'Applications fetched successfully')
    );
});

const getJobDataWithCount = asyncHandler(async (req: Request, res: Response) => {
    const jobData = await appliedJobsService.getJobDataWithCount();
    res.status(200).json(
        new ApiResponse(200, jobData, 'Job data with count fetched successfully')
    );
});

const getJobApplicantData = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const data = await appliedJobsService.getJobApplicantData(jobId as string);
    res.status(200).json(
        new ApiResponse(200, data, 'Job applicant data fetched successfully')
    );
});

const getApplicantDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId, resumeId } = req.query;
    const applicant = await appliedJobsService.getApplicantDetails(userId as string, resumeId as string);
    if (!applicant) {
        throw new ApiError(404, 'Applicant not found');
    }
    res.status(200).json(
        new ApiResponse(200, applicant, 'Applicant details fetched successfully')
    );
});

export {
    postJobAppliced,
    getUserJobPostData,
    getJobDataWithCount,
    getJobApplicantData,
    getApplicantDetails
};