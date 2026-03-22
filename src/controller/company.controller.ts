import { Request, Response } from "express";
import { companyService } from "../services/company.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const getCompanyData = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await companyService.getCompanyData(id as string);
    if (!result) {
        throw new ApiError(404, 'Company not found');
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Company data retrieved successfully')
    );
});

const getCompanyPersonalData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await companyService.getCompanyPersonalData(userId as string);
    if (!result) {
        throw new ApiError(404, 'Company profile not found');
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Company personal data retrieved successfully')
    );
});

const getCompanyProfileData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await companyService.getCompanyProfileData(userId as string);
    if (!result) {
        throw new ApiError(404, 'Company profile not found');
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Company profile retrieved successfully')
    );
});

const getComapnySocialData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await companyService.getCompanySocialData(userId as string);
    if (!result) {
        throw new ApiError(404, 'Social media links not found');
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Social media links retrieved successfully')
    );
});

const getComapnyContactsData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await companyService.getCompanyContactsData(userId as string);
    if (!result) {
        throw new ApiError(404, 'Company contact not found');
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Company contact retrieved successfully')
    );
});

const getCompanyDataForHome = asyncHandler(async (req: Request, res: Response) => {
    const result = await companyService.getCompanyDataForHome();
    res.status(200).json(
        new ApiResponse(200, result, 'Company data retrieved successfully')
    );
});

const getComapnyProfileCompleteData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await companyService.getCompanyProfileCompleteData(userId as string);
    if (!result) {
        throw new ApiError(404, "Company profile not found.");
    }
    res.status(200).json(
        new ApiResponse(200, result, 'Company profile retrieved successfully')
    );
});

export {
    getCompanyData,
    getCompanyPersonalData,
    getCompanyProfileData,
    getComapnySocialData,
    getComapnyContactsData,
    getCompanyDataForHome,
    getComapnyProfileCompleteData
};