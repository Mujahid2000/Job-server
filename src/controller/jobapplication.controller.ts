import { Request, Response } from "express";
import { jobApplicationService } from "../services/jobapplication.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const postJobApplication = asyncHandler(async (req: Request, res: Response) => {
  const savedJobData = await jobApplicationService.postJobApplication(req.body);
  res.status(201).json(
    new ApiResponse(201, savedJobData, 'Job posting created successfully')
  );
});

const postPromotedJobs = asyncHandler(async (req: Request, res: Response) => {
  const savePromotedData = await jobApplicationService.postPromotedJobs(req.body);
  res.status(201).json(
    new ApiResponse(201, savePromotedData, 'Data inserted successfully')
  );
});

const getAllPostedData = asyncHandler(async (req: Request, res: Response) => {
  const application = await jobApplicationService.getAllPostedData();
  res.status(200).json(
    new ApiResponse(200, application, 'Data retrieved successfully')
  );
});

const bookmarkJobPost = asyncHandler(async (req: Request, res: Response) => {
  const savedBookmark = await jobApplicationService.bookmarkJobPost(req.body);
  res.status(200).json(
    new ApiResponse(200, savedBookmark, 'Bookmark Job Post successfully.')
  );
});

const getAllUserBookMarkByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const getBookMarkData = await jobApplicationService.getAllUserBookMarkByEmail(email as string);
  res.status(200).json(
    new ApiResponse(200, getBookMarkData, 'Data retrieved successfully')
  );
});

const getUserAllJobPost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const getJobPostedDataById = await jobApplicationService.getUserAllJobPost(id as string);
  res.status(200).json(
    new ApiResponse(200, getJobPostedDataById, 'Data retrieved successfully')
  );
});

const getAllCompanyData = asyncHandler(async (req: Request, res: Response) => {
  const companyData = await jobApplicationService.getAllCompanyData();
  res.status(200).json(
    new ApiResponse(200, companyData, 'Company data retrieved successfully')
  );
});

const getSingleCompanyData = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const findSingleCompanyData = await jobApplicationService.getSingleCompanyData(id as string);
  res.status(200).json(
    new ApiResponse(200, findSingleCompanyData, 'Data retrieved successfully')
  );
});

const getSpecificCompanyData = asyncHandler(async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const results = await jobApplicationService.getSpecificCompanyData(companyId as string);
  res.status(200).json(
    new ApiResponse(200, results, 'Data found')
  );
});

export {
  postJobApplication,
  postPromotedJobs,
  getAllPostedData,
  bookmarkJobPost,
  getAllUserBookMarkByEmail,
  getUserAllJobPost,
  getAllCompanyData,
  getSingleCompanyData,
  getSpecificCompanyData
};