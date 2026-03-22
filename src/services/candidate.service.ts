import JobAppliedSchema from "../models/AppliedDataSchema";
import Bookmark from "../models/BookMarksModel";
import ApplicantModels from "../models/ApplicantModels";

const candidateApplyJobList = async (userId: string) => {
    return await JobAppliedSchema.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
                from: "jobpostingcollections",
                let: { jobIdStr: "$jobId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", { $toObjectId: "$$jobIdStr" }],
                            },
                        },
                    },
                ],
                as: "jobPosting",
            },
        },
        { $unwind: { path: "$jobPosting", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "companydatas",
                localField: "jobPosting.userId",
                foreignField: "userId",
                as: "companyData",
            },
        },
        { $unwind: { path: "$companyData", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                logo: "$companyData.logo",
                jobTitle: "$jobPosting.title",
                location: "$jobPosting.location",
                minSalary: "$jobPosting.minSalary",
                maxSalary: "$jobPosting.maxSalary",
                jobType: "$jobPosting.jobType",
                status: "$jobPosting.status",
            },
        },
        {
            $project: {
                logo: 1,
                jobTitle: 1,
                location: 1,
                minSalary: 1,
                maxSalary: 1,
                jobType: 1,
                date: 1,
                status: 1,
                jobId: 1,
            },
        },
    ]);
};

const candidateFavouriteJobList = async (email: string) => {
    return await Bookmark.aggregate([
        { $match: { email } },
        {
            $addFields: {
                companyIdObj: { $toObjectId: "$companyId" },
                jobObjId: { $toObjectId: "$jobId" }
            }
        },
        {
            $lookup: {
                from: "companydatas",
                localField: "companyIdObj",
                foreignField: "_id",
                as: "company"
            }
        },
        { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "jobpostingcollections",
                localField: "jobObjId",
                foreignField: "_id",
                as: "jobPost"
            }
        },
        { $unwind: { path: "$jobPost", preserveNullAndEmptyArrays: true } },
        {
            $set: {
                logo: "$company.logo",
                jobTitle: "$jobPost.title",
                location: "$jobPost.location",
                minSalary: "$jobPost.minSalary",
                maxSalary: "$jobPost.maxSalary",
                jobType: "$jobPost.jobType",
                postedDate: "$jobPost.postedDate",
                jobStatus: {
                    $cond: {
                        if: { $lt: ["$jobPost.expiryDate", "$$NOW"] },
                        then: "Job Expired",
                        else: "Active"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                email: 1,
                companyId: 1,
                jobId: 1,
                logo: 1,
                jobTitle: 1,
                location: 1,
                minSalary: 1,
                maxSalary: 1,
                jobType: 1,
                postedDate: 1,
                jobStatus: 1
            }
        }
    ]);
};

const candidateList = async () => {
    return await ApplicantModels.aggregate([
        {
            $lookup: {
                from: "personaldatas",
                localField: "userId",
                foreignField: "userId",
                as: "profiledata",
            },
        },
        { $unwind: { path: "$profiledata", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "contacts",
                localField: "userId",
                foreignField: "userId",
                as: "contact",
            },
        },
        { $unwind: { path: "$contact", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "resumecollections",
                localField: "userId",
                foreignField: "userId",
                as: "resume",
            },
        },
        {
            $set: {
                education: "$profiledata.education",
                gender: "$profiledata.gender",
                location: "$contact.mapLocation",
                resume_Id: "$resume._id",
            },
        },
        {
            $project: {
                profilePicture: 1,
                location: 1,
                gender: 1,
                fullName: 1,
                title: 1,
                education: 1,
                experience: 1,
                resume_Id: 1,
                userId: 1,
            },
        },
    ]);
};

export const candidateService = {
    candidateApplyJobList,
    candidateFavouriteJobList,
    candidateList,
};
