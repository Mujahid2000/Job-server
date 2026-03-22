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
exports.jobApplicationService = void 0;
const JobApplicationModels_1 = __importDefault(require("../models/JobApplicationModels"));
const PromotedJobs_1 = __importDefault(require("../models/PromotedJobs"));
const BookMarksModel_1 = __importDefault(require("../models/BookMarksModel"));
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../utils/ApiError");
const postJobApplication = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    const jobDetailsData = new JobApplicationModels_1.default(jobData);
    return yield jobDetailsData.save();
});
const postPromotedJobs = (promoData) => __awaiter(void 0, void 0, void 0, function* () {
    const promotedData = new PromotedJobs_1.default(promoData);
    return yield promotedData.save();
});
const getAllPostedData = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        {
            "$addFields": {
                "jobIdStr": { "$toString": "$_id" }
            }
        },
        {
            "$lookup": {
                "from": "promotedlists",
                "localField": "jobIdStr",
                "foreignField": "jobId",
                "as": "promotion"
            }
        },
        {
            "$lookup": {
                "from": "companydatas",
                "localField": "userId",
                "foreignField": "userId",
                "as": "companyData"
            }
        },
        {
            "$addFields": {
                "promotedSystem": {
                    "$let": {
                        "vars": {
                            "promotionItem": { "$arrayElemAt": ["$promotion", 0] }
                        },
                        "in": "$$promotionItem.promotedSystem"
                    }
                },
                "logo": {
                    "$let": {
                        "vars": {
                            "company": { "$arrayElemAt": ["$companyData", 0] }
                        },
                        "in": "$$company.logo"
                    }
                },
                "companyName": {
                    "$let": {
                        "vars": {
                            "company": { "$arrayElemAt": ["$companyData", 0] }
                        },
                        "in": "$$company.companyName"
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "userId": 1,
                "companyId": 1,
                "title": 1,
                "tags": 1,
                "jobRole": 1,
                "salaryType": 1,
                "minSalary": 1,
                "maxSalary": 1,
                "education": 1,
                "experience": 1,
                "jobType": 1,
                "expireDate": 1,
                "vacancy": 1,
                "jobLevel": 1,
                "biography": 1,
                "responsibilities": 1,
                "location": 1,
                "status": 1,
                "promotedSystem": 1,
                "logo": 1,
                "companyName": 1
            }
        }
    ]);
});
const bookmarkJobPost = (bookmarkData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, companyId, jobId, email } = bookmarkData;
    const existingBookmark = yield BookMarksModel_1.default.findOne({ userId, companyId, jobId, email });
    if (existingBookmark) {
        throw new ApiError_1.ApiError(400, 'You already bookmarked this job post.');
    }
    const newBookmark = new BookMarksModel_1.default(bookmarkData);
    return yield newBookmark.save();
});
const getAllUserBookMarkByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield BookMarksModel_1.default.find({ email });
});
const getUserAllJobPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.ApiError(400, 'Invalid ID format');
    }
    const results = yield JobApplicationModels_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "companydatas",
                localField: "userId",
                foreignField: "userId",
                as: "companysingleData"
            }
        },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contactData"
            }
        },
        {
            $lookup: {
                from: "founderinfos",
                localField: "userId",
                foreignField: "userId",
                as: "foundingData"
            }
        },
        {
            $set: {
                idStr: { $toString: "$_id" }
            }
        },
        {
            $lookup: {
                from: "promotedlists",
                localField: "idStr",
                foreignField: "jobId",
                as: "promoted"
            }
        },
        { $unwind: { path: "$promoted", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$companysingleData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$contactData", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$foundingData", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                logo: "$companysingleData.logo",
                companyName: "$companysingleData.companyName",
                expiryDate: {
                    $dateToString: { format: "%Y-%m-%d", date: "$expiryDate" }
                },
                postedDate: {
                    $dateToString: { format: "%Y-%m-%d", date: "$postedDate" }
                },
                email: "$contactData.email",
                phone: "$contactData.phoneNumber",
                organizationType: "$foundingData.organizationType",
                companySize: "$foundingData.teamSize",
                foundingDate: "$foundingData.yearEstablished",
                companyWebsite: "$foundingData.companyWebsite",
                industryType: "$foundingData.industryTypes"
            }
        },
        {
            $project: {
                "_id": 1,
                "userId": 1,
                "companyId": 1,
                "title": 1,
                "tags": 1,
                "jobRole": 1,
                "salaryType": 1,
                "minSalary": 1,
                "maxSalary": 1,
                "education": 1,
                "experience": 1,
                "jobType": 1,
                "expireDate": 1,
                "vacancy": 1,
                "jobLevel": 1,
                "biography": 1,
                "responsibilities": 1,
                "location": 1,
                "status": 1,
                "postedDate": 1,
                "logo": 1,
                "companyName": 1,
                "phone": 1,
                "email": 1,
                "organizationType": 1,
                "companySize": 1,
                "foundingDate": 1,
                "companyWebsite": 1,
                "industryType": 1
            }
        }
    ]);
    return results[0] || null;
});
const getAllCompanyData = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        {
            $lookup: {
                from: "companydatas",
                localField: "userId",
                foreignField: "userId",
                as: "company"
            }
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contactInfo"
            }
        },
        { $unwind: { path: "$contactInfo", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "founderinfos",
                localField: "userId",
                foreignField: "userId",
                as: "founding"
            }
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
                latestJob: { $first: "$$ROOT" }
            }
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
                            totalCompanyJobs: "$totalCompanyJobs"
                        }
                    ]
                }
            }
        },
        {
            $project: {
                _id: 0,
                companyName: 1,
                logo: 1,
                location: 1,
                totalCompanyJobs: 1,
                title: 1,
                tags: 1,
                jobRole: 1,
                postedDate: 1,
                organizationType: 1,
                userId: 1,
            }
        }
    ]);
});
const getSingleCompanyData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield CompanyModel_1.default.aggregate([
        { $match: { "userId": id } },
        {
            $lookup: {
                from: "founderinfos",
                localField: "userId",
                foreignField: "userId",
                as: "foundData"
            }
        },
        { $unwind: { path: "$foundData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "socialmediainfos",
                localField: "userId",
                foreignField: "userId",
                as: "socialLink"
            }
        },
        { $unwind: { path: "$socialLink", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contacInfo"
            }
        },
        { $unwind: { path: "$contacInfo", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                organizationType: "$foundData.organizationType",
                industryTypes: "$foundData.industryTypes",
                teamSize: "$foundData.teamSize",
                yearEstablished: "$foundData.yearEstablished",
                companyWebsite: "$foundData.companyWebsite",
                companyVision: "$foundData.companyVision",
                phoneNumber: "$contacInfo.phoneNumber",
                email: "$contacInfo.email",
                socialLink: "$socialLink.socialLinks"
            }
        },
        {
            $project: {
                banner: 1,
                logo: 1,
                biography: 1,
                companyName: 1,
                organizationType: 1,
                industryTypes: 1,
                teamSize: 1,
                yearEstablished: 1,
                companyWebsite: 1,
                companyVision: 1,
                phoneNumber: 1,
                email: 1,
                socialLink: 1,
                userId: 1
            }
        }
    ]);
    return results[0] || null;
});
const getSpecificCompanyData = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobApplicationModels_1.default.aggregate([
        { $match: { userId: companyId } },
        {
            $project: {
                title: 1,
                jobRole: 1,
                minSalary: 1,
                maxSalary: 1,
                location: 1,
                jobType: 1,
                biography: 1,
                _id: 1,
            }
        }
    ]);
});
exports.jobApplicationService = {
    postJobApplication,
    postPromotedJobs,
    getAllPostedData,
    bookmarkJobPost,
    getAllUserBookMarkByEmail,
    getUserAllJobPost,
    getAllCompanyData,
    getSingleCompanyData,
    getSpecificCompanyData,
};
