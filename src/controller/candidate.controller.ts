import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import JobAppliedSchema from "../models/AppliedDataSchema";
import Bookmark from "../models/BookMarksModel";
import ApplicantModels from "../models/ApplicantModels";


const candidateApplyJobList = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
   
     // Validate if userId is a valid string
     if (!userId || typeof userId !== 'string') {
       return res.status(400).json({ error: 'Invalid or missing userId' });
     }
   
     try {
       const appliedJobs = await JobAppliedSchema.aggregate([
         // Match by userId
         {
           $match: {
             userId: userId,
           },
         },
   
         // Lookup job details by converting string jobId to ObjectId
         {
           $lookup: {
             from: "jobpostingcollections",
             let: { jobIdStr: "$jobId" },
             pipeline: [
               {
                 $match: {
                   $expr: {
                     $eq: [
                       "$_id",
                       { $toObjectId: "$$jobIdStr" }
                     ],
                   },
                 },
               },
             ],
             as: "jobPosting",
           },
         },
         {
           $unwind: {
             path: "$jobPosting",
             preserveNullAndEmptyArrays: true,
           },
         },
   
         // Lookup company data based on jobPosting.userId
         {
           $lookup: {
             from: "companydatas",
             localField: "jobPosting.userId",
             foreignField: "userId",
             as: "companyData",
           },
         },
         {
           $unwind: {
             path: "$companyData",
             preserveNullAndEmptyArrays: true,
           },
         },
   
         // Set selected fields for response
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
   
         // Final projection
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
   
       return res.status(200).json({ success: true, data: appliedJobs });
   
     } catch (error) {
       console.error('Error fetching candidate applied job list:', error);
       return res.status(500).json({ success: false, error: 'Server error' });
     } 
})

const candidateFavouriteJobList = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;

  // Basic email format check
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address provided.' });
  }

  try {
    const favoriteJobs = await Bookmark.aggregate([
      {
        $match: { email }
      },
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
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "jobpostingcollections",
          localField: "jobObjId",
          foreignField: "_id",
          as: "jobPost"
        }
      },
      {
        $unwind: {
          path: "$jobPost",
          preserveNullAndEmptyArrays: true
        }
      },
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

    res.status(200).json({ success: true, data: favoriteJobs });

  } catch (error) {
    console.error("Error fetching favorite job list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


const candidateList = asyncHandler(async (req: Request, res: Response) => {
     try {
        const candidateList = await ApplicantModels.aggregate([
  {
    $lookup: {
      from: "personaldatas",
      localField: "userId",
      foreignField: "userId",
      as: "profiledata",
    },
  },
  {
    $unwind: {
      path: "$profiledata",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "contacts",
      localField: "userId",
      foreignField: "userId",
      as: "contact",
    },
  },
  {
    $unwind: {
      path: "$contact",
      preserveNullAndEmptyArrays: true,
    },
  },
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

        res.status(200).json({ success: true, data: candidateList });
    } catch (err) {
        console.error("Error fetching candidate list:", err);
        res.status(500).json({ error: "Internal Server Error" }); // Example error response
    }
})

export {
    candidateApplyJobList,
    candidateFavouriteJobList,
    candidateList
}
