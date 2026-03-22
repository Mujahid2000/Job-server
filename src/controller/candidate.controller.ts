import { Request, Response } from "express";
import { candidateService } from "../services/candidate.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const candidateApplyJobList = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const appliedJobs = await candidateService.candidateApplyJobList(userId as string);
    res.status(200).json(
        new ApiResponse(200, appliedJobs, 'Applied jobs fetched successfully')
    );
});

const candidateFavouriteJobList = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    const favoriteJobs = await candidateService.candidateFavouriteJobList(email as string);
    res.status(200).json(
        new ApiResponse(200, favoriteJobs, 'Favorite jobs fetched successfully')
    );
});

const candidateList = asyncHandler(async (req: Request, res: Response) => {
    const candidates = await candidateService.candidateList();
    res.status(200).json(
        new ApiResponse(200, candidates, 'Candidate list fetched successfully')
    );
});

export {
    candidateApplyJobList,
    candidateFavouriteJobList,
    candidateList
};
