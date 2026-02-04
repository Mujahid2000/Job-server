import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import JobPosting from "../models/JobApplicationModels";
import promotedJobs from "../models/PromotedJobs";
import Bookmark from "../models/BookMarksModel";
import mongoose from "mongoose";
import CompanyModel from "../models/CompanyModel";


const postJobApplication = asyncHandler(async (req: Request, res: Response) => {
    const {
        userId, companyId, title, tags, jobRole, salaryType, minSalary, maxSalary,
        education, experience, jobType, expiryDate, vacancies, jobLevel, biography,
        responsibilities, applyMethod, location
    } = req.body;

    try {
        // Step 1: Input validation - check for required fields
        if (!userId || !companyId || !title || !jobRole || !salaryType ||
            !minSalary || !maxSalary || !education || !experience || !jobType ||
            !expiryDate || !vacancies || !jobLevel || !biography || !responsibilities || !applyMethod || !tags || !location
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: all fields except tags and status are required'
            });
        }

        // Step 2: Type validation for critical fields
        if (isNaN(minSalary) || isNaN(maxSalary)) {
            return res.status(400).json({
                success: false,
                message: 'minSalary and maxSalary must be numbers'
            });
        }

        const parsedMinSalary = Number(minSalary);
        const parsedMaxSalary = Number(maxSalary);
        const parsedExpireDate = new Date(expiryDate);

        if (isNaN(parsedExpireDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'expireDate must be a valid date'
            });
        }

        // Step 3: Create job data object
        const jobDetailsData = new JobPosting({
            userId,
            companyId,
            title,
            tags: tags || [], // Default to empty array if tags are not provided
            jobRole,
            salaryType,
            minSalary: parsedMinSalary,
            maxSalary: parsedMaxSalary,
            education,
            experience,
            jobType,
            expiryDate: parsedExpireDate,
            vacancies,
            jobLevel,
            biography,
            responsibilities,
            applyMethod,
            location

        });



        // Step 4: Save the job data to the database
        const savedJobData = await jobDetailsData.save();



        // Step 5: Send success response
        res.status(201).json({
            success: true,
            message: 'Job posting created successfully',
            data: savedJobData
        });
    } catch (error: any) {
        // Step 6: Handle errors
        console.error('Error in /jobPost:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors as any).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry: jobId already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating job posting',
            error: error.message
        });
    }
})


const postPromotedJobs = asyncHandler(async (req: Request, res: Response) => {
    const { userId, jobId, companyId, promotedSystem } = req.body;
    // console.log(userId, jobId, companyId, promotedSystem)
    try {
        if (!userId || !jobId || !companyId || !promotedSystem) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: all fields except tags and status are required'
            });
        }

        const promotedData = new promotedJobs({
            userId: userId,
            jobId,
            companyId,
            promotedSystem
        })
        const savePromotedData = await promotedData.save()

        res.status(201).json({
            success: true,
            message: 'Data inserted successfully',
            data: savePromotedData
        });
    } catch (error: any) {
        console.error('Error in /PromotedJObs:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error inserting promoted job data',
            error: error.message
        });
    }
})


const getAllPostedData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const application = await JobPosting.aggregate([
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
                    "jobTitle": 1,
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
                    "description": 1,
                    "responsibilities": 1,
                    "location": 1,
                    "status": 1,
                    "promotedSystem": 1,
                    "logo": 1,
                    "companyName": 1
                }
            }
        ]
        )
        res.status(201).json({
            success: true,
            message: 'Data inserted successfully',
            data: application
        });
    } catch (error) {
        console.error({ error, message: 'no data found' })
    }
})


const bookmarkJobPost = asyncHandler(async (req: Request, res: Response) => {
    const { userId, companyId, jobId, email } = req.body;

    try {
        if (!userId || !companyId || !jobId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: all fields are required'
            });
        }

        // ✅ await the query
        const existingBookmark = await Bookmark.findOne({
            userId,
            companyId,
            jobId,
            email
        });

        if (existingBookmark) {
            return res.status(200).json({
                success: false,
                message: 'You already bookmarked this job post.'
            });
        }

        // ✅ Create a new bookmark instance
        const newBookmark = new Bookmark({
            userId,
            companyId,
            jobId,
            email
        });

        const savedBookmark = await newBookmark.save();

        return res.status(200).json({
            success: true,
            message: 'Bookmark Job Post successfully.',
            data: savedBookmark
        });

    } catch (error: any) {
        console.error('Error in /bookMarkPost:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error occurred.',
            error: error.message
        });
    }
})


const getAllUserBookMarkByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const getBookMarkData = await Bookmark.find({ email: email })
        res.status(200).json({ message: 'data get successfully', data: getBookMarkData })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Server error occurred.',
            error: error.message
        });
    }
})


const getUserAllJobPost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const getJobPostedDataById = await JobPosting.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(`${id}`)
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
                {
                    $unwind: {
                        "path": "$promoted",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $unwind: {
                        "path": "$companysingleData",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $unwind: {
                        path: "$contactData",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $unwind: {
                        path: "$foundingData",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $set: {
                        logo: "$companysingleData.logo",
                        companyName: "$companysingleData.companyName",
                        expiryDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$expiryDate"
                            }
                        },
                        postedDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$expiryDate"
                            }
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
                        "promotedSystem": 1,
                        "postedDate": 1,
                        "logo": 1,
                        "companyName": 1,
                        "promoted.jobId": 1,
                        "expiryDate": 1,
                        "phone": 1,
                        "email": 1,
                        "organizationType": 1,
                        "companySize": 1,
                        "foundingDate": 1,
                        "companyWebsite": 1,
                        "industryType": 1
                    }
                }
            ]


        );

        res.status(200).json({
            message: 'Get single data by ID',
            data: getJobPostedDataById[0] || null // return the first (and only) item
        });

    } catch (error) {
        console.error('Aggregation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

const getAllCompanyData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const companyData = await JobPosting.aggregate([
            {
                $lookup: {
                    from: "companydatas",
                    localField: "userId",
                    foreignField: "userId",
                    as: "company"
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "contacts",
                    localField: "userId",
                    foreignField: "userId",
                    as: "contactInfo"
                }
            },
            {
                $unwind: {
                    path: "$contactInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "founderinfos",
                    localField: "userId",
                    foreignField: "userId",
                    as: "founding"
                }
            },
            {
                $unwind: {
                    path: "$founding",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalCompanyJobs: { $sum: 1 },
                    companyName: { $first: "$company.companyName" },
                    logo: { $first: "$company.logo" },
                    location: { $first: "$contactInfo.mapLocation" },
                    organizationType: { $first: "$founding.organizationType" },
                    latestJob: { $first: "$$ROOT" } // get one example job for context
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
                    //   "_id": 1,  remembar when test api
                }
            }
        ]

        );

        res.status(200).json({
            message: 'Company data retrieved successfully',
            data: companyData || []
        });
    } catch (error: any) {
        console.error('Error in /getCompanyData:', error.message);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
})

const getSingleCompanyData = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const findSingleCompanyData = await CompanyModel.aggregate(
            [
                {
                    $match: {
                        "userId": `${id}`
                    }
                },

                {
                    $lookup: {
                        from: "founderinfos",
                        localField: "userId",
                        foreignField: "userId",
                        as: "foundData"
                    }
                },
                {
                    $unwind: {
                        path: "$foundData",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $lookup: {
                        from: "socialmediainfos",
                        localField: "userId",
                        foreignField: "userId",
                        as: "socialLink"
                    }
                },
                {
                    $unwind: {
                        path: "$socialLink",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: "contacts",
                        localField: "userId",
                        foreignField: "userId",
                        as: "contacInfo"
                    }
                },
                {
                    $unwind: {
                        path: "$contacInfo",
                        preserveNullAndEmptyArrays: true
                    }
                },

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
                        "organizationType": 1,
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
            ]
        )
        res.status(200).json({
            message: 'Get Single Company Data',
            data: findSingleCompanyData[0]
        })
    } catch (error) {
        console.error('Aggregation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


const getSpecificCompanyData = asyncHandler(async(req:Request, res:Response) =>{
    try {
    const { companyId } = req.params;

    // Validate companyId (example: ensure it's a non-empty string or ObjectId)
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    const getSpecificCompanyData = await JobPosting.aggregate([
      {
        $match: {
          userId: companyId, // Using companyId directly (assuming userId is the correct field)
        },
      },
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
        },
      },
    ]);

    // Check if data is found
    if (getSpecificCompanyData.length === 0) {
      return res.status(404).json({ message: 'Job data not found' });
    }

    // Return success response
    res.status(200).json({ message: 'Data found', data: getSpecificCompanyData });
  } catch (error:any) {
    console.error('Aggregation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

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
}