import { Request, Response } from "express";
import { accountSetupService } from "../services/accountsetup.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const postCompanyData = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files || !files.logo || !files.banner) {
    throw new ApiError(400, 'Logo and Banner are required');
  }

  const result = await accountSetupService.postCompanyData(req.body, files);
  res.status(201).json(
    new ApiResponse(201, result, 'Company data saved successfully')
  );
});

const postFounderInfo = asyncHandler(async (req: Request, res: Response) => {
  
  const result = await accountSetupService.postFounderInfo(req.body);
  
  res.status(201).json(
    new ApiResponse(201, result, 'Founder info saved successfully')
  );
});

const postContactInfo = asyncHandler(async (req: Request, res: Response) => {
  const result = await accountSetupService.postContactInfo(req.body);
  res.status(201).json(
    new ApiResponse(201, result, 'Contact info saved successfully')
  );
});

const postSocialMediaInfo = asyncHandler(async (req: Request, res: Response) => {
  const result = await accountSetupService.postSocialMediaInfo(req.body);
  res.status(201).json(
    new ApiResponse(201, result, 'Social media links saved successfully')
  );
});

const getContactData = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await accountSetupService.getContactData(email as string);
  res.status(200).json(
    new ApiResponse(200, result, 'Contact data retrieved successfully')
  );
});

export {
  postCompanyData,
  postFounderInfo,
  postContactInfo,
  postSocialMediaInfo,
  getContactData
};
