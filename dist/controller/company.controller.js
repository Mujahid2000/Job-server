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
exports.getComapnyProfileCompleteData = exports.getCompanyDataForHome = exports.getComapnyContactsData = exports.getComapnySocialData = exports.getCompanyProfileData = exports.getCompanyPersonalData = exports.getCompanyData = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const FounderInfoModel_1 = __importDefault(require("../models/FounderInfoModel"));
const SocialMediaModel_1 = __importDefault(require("../models/SocialMediaModel"));
const ContactSchema_1 = __importDefault(require("../models/ContactSchema"));
const JobApplicationModels_1 = __importDefault(require("../models/JobApplicationModels"));
const getCompanyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id; // Extract id as a string
    try {
        // Use aggregation to fetch data from both collections
        const result = yield CompanyModel_1.default.aggregate([
            {
                $match: { userId: id } // Match the userId in CompanyModel
            },
            {
                $lookup: {
                    from: 'contacts',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'contactData'
                }
            },
            {
                $project: {
                    userId: 1,
                    companyName: 1,
                    mapLocation: {
                        $ifNull: [
                            { $arrayElemAt: ['$contactData.mapLocation', 0] }, // Get mapLocation from first contact
                            null // Default to null if no contact data
                        ]
                    }
                }
            }
        ]);
        if (!result || result.length === 0) {
            throw new ApiError_1.ApiError(404, 'Company not found');
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, result[0], 'Company data retrieved successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getCompanyData = getCompanyData;
const getCompanyPersonalData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Use lean() for better performance if you don't need mongoose document methods
        const companyPersonal = yield CompanyModel_1.default.findOne({ userId }).lean();
        if (!companyPersonal) {
            throw new ApiError_1.ApiError(404, 'Company profile not found');
        }
        // Optionally, remove sensitive fields before sending response
        // delete companyProfile.sensitiveField;
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, companyPersonal, 'Company personal data retrieved successfully'));
    }
    catch (error) {
        console.error('Error fetching company profile:', error);
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getCompanyPersonalData = getCompanyPersonalData;
const getCompanyProfileData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Basic validation: check if userId is provided and is a non-empty string
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        throw new ApiError_1.ApiError(400, 'Invalid or missing userId parameter');
    }
    try {
        const companyProfile = yield FounderInfoModel_1.default.findOne({ userId }).lean();
        if (!companyProfile) {
            throw new ApiError_1.ApiError(404, 'Company profile not found');
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, companyProfile, 'Company profile retrieved successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getCompanyProfileData = getCompanyProfileData;
const getComapnySocialData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        throw new ApiError_1.ApiError(400, 'Invalid or missing userId parameter');
    }
    try {
        const companySocialLink = yield SocialMediaModel_1.default.findOne({ userId }).lean();
        if (!companySocialLink) {
            throw new ApiError_1.ApiError(404, 'Social media links not found');
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, companySocialLink, 'Social media links retrieved successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getComapnySocialData = getComapnySocialData;
const getComapnyContactsData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        throw new ApiError_1.ApiError(400, 'Invalid or missing userId parameter');
    }
    try {
        const companyContact = yield ContactSchema_1.default.findOne({ userId }).lean();
        if (!companyContact) {
            throw new ApiError_1.ApiError(404, 'Company contact not found');
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, companyContact, 'Company contact retrieved successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getComapnyContactsData = getComapnyContactsData;
const getCompanyDataForHome = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCompanyProfile = yield JobApplicationModels_1.default.aggregate([
            // Lookup from companydatas
            {
                $lookup: {
                    from: "companydatas",
                    localField: "userId",
                    foreignField: "userId",
                    as: "company",
                },
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Lookup from contacts
            {
                $lookup: {
                    from: "contacts",
                    localField: "userId",
                    foreignField: "userId",
                    as: "contactInfo",
                },
            },
            {
                $unwind: {
                    path: "$contactInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Lookup from founderinfos
            {
                $lookup: {
                    from: "founderinfos",
                    localField: "userId",
                    foreignField: "userId",
                    as: "founding",
                },
            },
            {
                $unwind: {
                    path: "$founding",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Group by userId
            {
                $group: {
                    _id: "$userId",
                    totalCompanyJobs: { $sum: 1 },
                    companyName: {
                        $first: "$company.companyName",
                    },
                    logo: { $first: "$company.logo" },
                    location: {
                        $first: "$contactInfo.mapLocation",
                    },
                    organizationType: {
                        $first: "$founding.organizationType",
                    },
                    industryType: {
                        $first: "$founding.industryTypes",
                    }, // 👈 Added this
                    employee: { $first: "$founding.teamSize" }, // 👈 Added this
                    latestJob: { $first: "$$ROOT" },
                },
            },
            // Merge job info + additional fields
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$latestJob",
                            {
                                companyName: "$companyName",
                                logo: "$logo",
                                location: "$location",
                                organizationType: "$organizationType",
                                industryType: "$industryType",
                                totalCompanyJobs: "$totalCompanyJobs",
                                employee: "$employee",
                                featured: "featured",
                            },
                        ],
                    },
                },
            },
            // Final projection
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    companyName: 1,
                    logo: 1,
                    location: 1,
                    totalCompanyJobs: 1,
                    title: 1,
                    tags: 1,
                    jobRole: 1,
                    postedDate: 1,
                    organizationType: 1,
                    industryType: 1, // 👈 Included this
                    featured: 1,
                    employee: 1,
                },
            },
        ]);
        // Success response
        res.status(200).json(new ApiResponse_1.ApiResponse(200, getCompanyProfile, 'Company data retrieved successfully'));
    }
    catch (error) {
        console.error("Error fetching company data:", error);
        throw new ApiError_1.ApiError(500, "Server Error. Unable to fetch company data.", [error.message]);
    }
}));
exports.getCompanyDataForHome = getCompanyDataForHome;
const getComapnyProfileCompleteData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const companyProfile = yield CompanyModel_1.default.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "userId",
                    foreignField: "userId",
                    as: "contact"
                }
            },
            {
                $unwind: {
                    path: "$contact",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "founderinfos",
                    localField: "userId",
                    foreignField: "userId",
                    as: "found"
                }
            },
            {
                $unwind: {
                    path: "$found",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "socialmediainfos",
                    localField: "userId",
                    foreignField: "userId",
                    as: "social"
                }
            },
            {
                $unwind: {
                    path: "$social",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $set: {
                    mapLocation: "$contact.mapLocation",
                    phoneNumber: "$contact.phoneNumber",
                    email: "$contact.email",
                    organizationType: "$found.organizationType",
                    industryType: "$found.industryTypes",
                    teamSize: "$found.industryTypes",
                    yearEstablished: "$found.yearEstablished",
                    companyWebsite: "$found.companyWebsite",
                    social: "$social.socialLinks",
                    noComplete: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $eq: [
                                            "$contact.mapLocation",
                                            null
                                        ]
                                    },
                                    {
                                        $eq: [
                                            "$contact.phoneNumber",
                                            null
                                        ]
                                    },
                                    { $eq: ["$contact.email", null] },
                                    {
                                        $eq: [
                                            "$found.organizationType",
                                            null
                                        ]
                                    },
                                    {
                                        $eq: [
                                            "$found.industryTypes",
                                            null
                                        ]
                                    },
                                    {
                                        $eq: [
                                            "$found.yearEstablished",
                                            null
                                        ]
                                    },
                                    {
                                        $eq: [
                                            "$found.companyWebsite",
                                            null
                                        ]
                                    },
                                    {
                                        $eq: ["$social.socialLinks", null]
                                    }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    companyName: 1,
                    logo: 1,
                    banner: 1,
                    biography: 1,
                    mapLocation: 1,
                    phoneNumber: 1,
                    email: 1,
                    organizationType: 1,
                    industryType: 1,
                    teamSize: 1,
                    yearEstablished: 1,
                    companyWebsite: 1,
                    social: 1,
                    noComplete: 1
                }
            }
        ]);
        if (!companyProfile.length) {
            throw new ApiError_1.ApiError(404, "Company profile not found.");
        }
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, companyProfile[0], 'Company profile retrieved successfully'));
    }
    catch (error) {
        console.error("Error fetching company profile:", error);
        throw new ApiError_1.ApiError(500, "Server error", [error.message]);
    }
}));
exports.getComapnyProfileCompleteData = getComapnyProfileCompleteData;
