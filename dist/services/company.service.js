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
exports.companyService = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const FounderInfoModel_1 = __importDefault(require("../models/FounderInfoModel"));
const SocialMediaModel_1 = __importDefault(require("../models/SocialMediaModel"));
const ContactSchema_1 = __importDefault(require("../models/ContactSchema"));
const JobApplicationModels_1 = __importDefault(require("../models/JobApplicationModels"));
const getCompanyData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield CompanyModel_1.default.aggregate([
        { $match: { userId: id } },
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
                        { $arrayElemAt: ['$contactData.mapLocation', 0] },
                        null
                    ]
                }
            }
        }
    ]);
    return result[0] || null;
});
const getCompanyPersonalData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield CompanyModel_1.default.findOne({ userId }).lean();
});
const getCompanyProfileData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield FounderInfoModel_1.default.findOne({ userId }).lean();
});
const getCompanySocialData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield SocialMediaModel_1.default.findOne({ userId }).lean();
});
const getCompanyContactsData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ContactSchema_1.default.findOne({ userId }).lean();
});
const getCompanyDataForHome = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        {
            $lookup: {
                from: "companydatas",
                localField: "userId",
                foreignField: "userId",
                as: "company",
            },
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contactInfo",
            },
        },
        { $unwind: { path: "$contactInfo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "founderinfos",
                localField: "userId",
                foreignField: "userId",
                as: "founding",
            },
        },
        { $unwind: { path: "$founding", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$userId",
                totalCompanyJobs: { $sum: 1 },
                companyName: { $first: "$company.companyName" },
                logo: { $first: "$company.logo" },
                location: { $first: "$contactInfo.mapLocation" },
                organizationType: { $first: "$founding.organizationType" },
                industryType: { $first: "$founding.industryTypes" },
                employee: { $first: "$founding.teamSize" },
                latestJob: { $first: "$$ROOT" },
            },
        },
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
                industryType: 1,
                featured: 1,
                employee: 1,
            },
        },
    ]);
});
const getCompanyProfileCompleteData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield CompanyModel_1.default.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contact"
            }
        },
        { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "founderinfos",
                localField: "userId",
                foreignField: "userId",
                as: "found"
            }
        },
        { $unwind: { path: "$found", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "socialmediainfos",
                localField: "userId",
                foreignField: "userId",
                as: "social"
            }
        },
        { $unwind: { path: "$social", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                mapLocation: "$contact.mapLocation",
                phoneNumber: "$contact.phoneNumber",
                email: "$contact.email",
                organizationType: "$found.organizationType",
                industryType: "$found.industryTypes",
                teamSize: "$found.teamSize",
                yearEstablished: "$found.yearEstablished",
                companyWebsite: "$found.companyWebsite",
                social: "$social.socialLinks",
                noComplete: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ["$contact.mapLocation", null] },
                                { $eq: ["$contact.phoneNumber", null] },
                                { $eq: ["$contact.email", null] },
                                { $eq: ["$found.organizationType", null] },
                                { $eq: ["$found.industryTypes", null] },
                                { $eq: ["$found.yearEstablished", null] },
                                { $eq: ["$found.companyWebsite", null] },
                                { $eq: ["$social.socialLinks", null] }
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
    return results[0] || null;
});
exports.companyService = {
    getCompanyData,
    getCompanyPersonalData,
    getCompanyProfileData,
    getCompanySocialData,
    getCompanyContactsData,
    getCompanyDataForHome,
    getCompanyProfileCompleteData,
};
