const express = require('express');
const JobAppliedSchema = require('../models/AppliedDataSchema');
const router = express.Router();
const JobPosting = require('../models/JobApplicationModels');
const ApplicantModels = require('../models/ApplicantModels');
// POST /jobAppliedJobPost - Apply for a job
router.post('/jobAppliedJobPost', async (req, res) => {
    try {
        const { userId, email, jobId, resume_Id, coverLetter } = req.body;
       
        // Validate required fields
        if (!userId || !email || !jobId || !resume_Id || !coverLetter) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if already applied
        const existingApplication = await JobAppliedSchema.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }

        // Create and save new application
        const appliedData = new JobAppliedSchema({ userId, email, jobId, resume_Id, coverLetter });
        const savedApplication = await appliedData.save();

        return res.status(201).json({
            message: 'Job application submitted successfully.',
            result: savedApplication
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});



router.get("/getUserJobPostData/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const results = await JobPosting.aggregate([
      {
        $match: {
          userId: userId
        }
      },
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
        $set: {
          logo: "$company.logo"
        }
      },
      {
        $lookup: {
          from: "jobapplydatas",
          let: { jobIdStr: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$jobId", "$$jobIdStr"]
                }
              }
            }
          ],
          as: "applications"
        }
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" }
        }
      },
      {
        $project: {
          logo: 1,
          title: 1,
          location: 1,
          userId: 1,
          salaryType: 1,
          minSalary: 1,
          maxSalary: 1,
          jobType: 1,
          applicationCount: 1,
          status:1
        }
      }
    ]);

    res.status(200).json({ jobs: results });
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get('/getJobApplicantData/:jobId', async (req, res) => {
  const { jobId } = req.params;
  try {
    if (!jobId) {
      return res.status(400).json({ success: false, error: 'Job ID is required' });
    }

    const data = await JobAppliedSchema.aggregate([
  {
    $match: {
      jobId: `${jobId}`,
    },
  },
  {
    $lookup: {
      from: "applicants",
      localField: "userId",
      foreignField: "userId",
      as: "applicantsLists",
    },
  },
  {
    $unwind: {
      path: "$applicantsLists",
      preserveNullAndEmptyArrays: true,
    },
  },
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
                { $toObjectId: "$$jobIdStr" },
              ],
            },
          },
        },
      ],
      as: "jobDetails",
    },
  },
  {
    $unwind: {
      path: "$jobDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    // ✅ Use a pipeline lookup to compare jobDetails.userId with company userId
    $lookup: {
      from: "companydatas",
      let: {
        companyUserId: "$jobDetails.userId",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$userId", "$$companyUserId"],
            },
          },
        },
      ],
      as: "company",
    },
  },
  {
    $unwind: {
      path: "$company",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "resumecollections",
      let: { resumeIdStr: "$resume_Id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                { $toString: "$_id" },
                "$$resumeIdStr",
              ],
            },
          },
        },
      ],
      as: "resumeDetails",
    },
  },
  {
    $unwind: {
      path: "$resumeDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $set: {
      profilePicture:
        "$applicantsLists.profilePicture",
      experience: "$applicantsLists.experience",
      education: "$applicantsLists.education",
      fullName: "$applicantsLists.fullName",
      title: "$applicantsLists.title",
      resumeLink: "$resumeDetails.resumeUrl",
      resume_Id: {
        $toString: "$resumeDetails._id",
      },
      companyUserId: "$jobDetails.userId", // ✅ Renamed
      companyName: "$company.companyName",
    },
  },
  {
    $project: {
      profilePicture: 1,
      experience: 1,
      education: 1,
      fullName: 1,
      title: 1,
      date: 1,
      resumeLink: 1,
      userId: 1,
      resume_Id: 1,
      jobId: 1,
      companyUserId: 1,
      companyName: 1,
    },
  },
]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching job applicant data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
});


router.get('/getApplicantDetails', async (req, res) => {
  try {
    const { userId, resumeId } = req.query;


    if (!userId || !resumeId) {
      return res.status(400).json({ message: 'userId and resumeId are required' });
    }

    const getApplicantDetails = await ApplicantModels.aggregate([
      {
        $match: {
          userId: userId
        }
      },
      {
        $lookup: {
          from: 'personaldatas',
          localField: 'userId',
          foreignField: 'userId',
          as: 'personal'
        }
      },
      { $unwind: { path: '$personal', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'socialmediainfos',
          localField: 'userId',
          foreignField: 'userId',
          as: 'socialLinks'
        }
      },
      { $unwind: { path: '$socialLinks', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'contacts',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userContact'
        }
      },
      { $unwind: { path: '$userContact', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'jobapplydatas',
          localField: 'userId',
          foreignField: 'userId',
          as: 'jobApplyData'
        }
      },
      { $unwind: { path: '$jobApplyData', preserveNullAndEmptyArrays: true } },

      // Match resume from resumecollections using resumeId
      {
        $lookup: {
          from: 'resumecollections',
          let: { resumeIdStr: resumeId },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$resumeIdStr']
                }
              }
            }
          ],
          as: 'userResume'
        }
      },
      { $unwind: { path: '$userResume', preserveNullAndEmptyArrays: true } },

      {
        $set: {
          mapLocation: '$userContact.mapLocation',
          phoneNumber: '$userContact.phoneNumber',
          biography: '$personal.biography',
          dateOfBirth: '$personal.dateOfBirth',
          country: '$personal.country',
          experience: '$personal.experience',
          education: '$personal.education',
          gender: '$personal.gender',
          maritalStatus: '$personal.maritalStatus',
          socialLink: '$socialLinks.socialLinks',
          resumeName: '$userResume.resumeName',
          resumeUrl: '$userResume.resumeUrl',
          resumeSize: '$userResume.size',
          resumeId: '$userResume._id',
          coverLetter: '$jobApplyData.coverLetter',
          ApplyDate: '$jobApplyData.date'
        }
      },
      {
        $project: {
          mapLocation: 1,
          phoneNumber: 1,
          email: 1,
          biography: 1,
          dateOfBirth: 1,
          country: 1,
          experience: 1,
          education: 1,
          gender: 1,
          maritalStatus: 1,
          socialLink: 1,
          resumeName: 1,
          resumeUrl: 1,
          resumeSize: 1,
          coverLetter: 1,
          ApplyDate: 1,
          profilePicture: 1,
          portfolio: 1,
          fullName: 1,
          title: 1,
          email: 1,
          resumeId:1,
          userId: 1
        }
      }
    ]);

    if (!getApplicantDetails || getApplicantDetails.length === 0) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    res.status(200).json({ success: true, applicant: getApplicantDetails[0] });
  } catch (error) {
    console.error('Error fetching applicant details:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;