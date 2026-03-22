import { Request, Response } from "express";
import { applicantService } from "../services/applicant.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const postApplicant = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Profile picture is required');
  }
  const applicant = await applicantService.postApplicant(req.body, req.file);
  res.status(201).json(
    new ApiResponse(201, applicant, 'Applicant created successfully')
  );
});

const getResumesByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const resumes = await applicantService.getResumesByEmail(email as string);
  res.status(200).json(
    new ApiResponse(200, resumes, 'Resume data fetched successfully')
  );
});

const uploadCv = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'No resume file provided');
  }
  const resume = await applicantService.uploadCv(req.body, req.file);
  res.status(201).json(
    new ApiResponse(201, resume, 'CV/Resume uploaded successfully')
  );
});

const getApplicantByEmail = asyncHandler(async (req: Request, res: Response) => {
  const applicant = await applicantService.getApplicantByEmail(req.params.email as string);
  res.status(200).json(
    new ApiResponse(200, applicant, 'Applicant found')
  );
});

const postPersonalData = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicantService.postPersonalData(req.body);
  res.status(201).json(
    new ApiResponse(201, data, 'Personal data inserted successfully')
  );
});

const updateNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicantService.updateNotification(req.params.id as string, req.body);
  res.status(200).json(
    new ApiResponse(200, result, 'Notification updated successfully')
  );
});

const getNotificationData = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicantService.getNotificationData(req.params.userId as string);
  res.status(200).json(
    new ApiResponse(200, result, 'Notification data retrieved successfully')
  );
});

const updateJobAlerts = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicantService.updateJobAlerts(req.params.userId as string, req.body);
  res.status(200).json(
    new ApiResponse(200, result, 'Job alerts updated successfully')
  );
});

const getJobAlertsData = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicantService.getJobAlertsData(req.params.userId as string);
  res.status(200).json(
    new ApiResponse(200, data, 'Job alerts data retrieved successfully')
  );
});

const updatePrivacy = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicantService.updatePrivacy(req.params.userId as string, req.body);
  res.status(200).json(
    new ApiResponse(200, result, 'Privacy mode updated successfully')
  );
});

const getProfilePrivacyData = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicantService.getProfilePrivacyData(req.params.userId as string);
  res.status(200).json(
    new ApiResponse(200, data, 'Privacy data retrieved successfully')
  );
});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = await applicantService.updatePassword(req.params.userId as string, currentPassword, newPassword);
  res.status(200).json(
    new ApiResponse(200, result, 'Password updated successfully')
  );
});

const getProfileComplete = asyncHandler(async (req: Request, res: Response) => {
  const result = await applicantService.getProfileComplete(req.params.userId as string);
  res.status(200).json(
    new ApiResponse(200, result, result.message)
  );
});

export {
  postApplicant,
  getResumesByEmail,
  uploadCv,
  getApplicantByEmail,
  postPersonalData,
  updateNotification,
  getNotificationData,
  updateJobAlerts,
  getJobAlertsData,
  updatePrivacy,
  getProfilePrivacyData,
  updatePassword,
  getProfileComplete
};
