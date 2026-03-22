import JobPosting from "../models/JobApplicationModels";
import promotedJobs from "../models/PromotedJobs";
import Bookmark from "../models/BookMarksModel";
import CompanyModel from "../models/CompanyModel";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

const postJobApplication = async (jobData: any) => {
  const jobDetailsData = new JobPosting(jobData);
  return await jobDetailsData.save();
};

const postPromotedJobs = async (promoData: any) => {
  const promotedData = new promotedJobs(promoData);
  return await promotedData.save();
};

const getAllPostedData = async () => {
  return await JobPosting.aggregate([
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
};

const bookmarkJobPost = async (bookmarkData: any) => {
  const { userId, companyId, jobId, email } = bookmarkData;
  console.log(bookmarkData);
  const existingBookmark = await Bookmark.findOne({ userId, companyId, jobId, email });
  if (existingBookmark) {
    throw new ApiError(400, 'You already bookmarked this job post.');
  }

  const newBookmark = new Bookmark(bookmarkData);
  return await newBookmark.save();
};

const getAllUserBookMarkByEmail = async (email: string) => {
  return await Bookmark.find({ email });
};

const getUserAllJobPost = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }

  const results = await JobPosting.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id)
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
};

const getAllCompanyData = async () => {
  return await JobPosting.aggregate([
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
};

const getSingleCompanyData = async (id: string) => {
  const results = await CompanyModel.aggregate([
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
};

const getSpecificCompanyData = async (companyId: string) => {
  return await JobPosting.aggregate([
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
};

export const jobApplicationService = {
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
