import CompanyModel from "../models/CompanyModel";
import FounderInfo from "../models/FounderInfoModel";
import SocialMedia from "../models/SocialMediaModel";
import LastContact from "../models/ContactSchema";
import JobPosting from "../models/JobApplicationModels";
import { ApiError } from "../utils/ApiError";

const getCompanyData = async (id: string) => {
    const result = await CompanyModel.aggregate([
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
};

const getCompanyPersonalData = async (userId: string) => {
    return await CompanyModel.findOne({ userId }).lean();
};

const getCompanyProfileData = async (userId: string) => {
    return await FounderInfo.findOne({ userId }).lean();
};

const getCompanySocialData = async (userId: string) => {
    return await SocialMedia.findOne({ userId }).lean();
};

const getCompanyContactsData = async (userId: string) => {
    return await LastContact.findOne({ userId }).lean();
};

const getCompanyDataForHome = async () => {
    return await JobPosting.aggregate([
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
};

const getCompanyProfileCompleteData = async (userId: string) => {
    const results = await CompanyModel.aggregate([
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
};

export const companyService = {
    getCompanyData,
    getCompanyPersonalData,
    getCompanyProfileData,
    getCompanySocialData,
    getCompanyContactsData,
    getCompanyDataForHome,
    getCompanyProfileCompleteData,
};
