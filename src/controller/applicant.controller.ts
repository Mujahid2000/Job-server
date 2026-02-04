import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import ApplicantModel from "../models/ApplicantModels";
import ResumeSchema from "../models/ResumeSchema";
import CandidatePersonalDataSchema from "../models/CandidatePersonalDataSchema";
import UserSchema from "../models/UserModels";
import NotificationSchemas from "../models/NotificationSchema";
import JobAlertSchemas from "../models/JobAlertsSchema";
import ProfilePrivacySchemas from "../models/ProfilePrivacySchema";
import { Types } from "mongoose";
import { cloudinaryUploadBuffer } from "../utils/FileUploader";

const postApplicant = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, title, email, experience, education, portfolio, fullName } = req.body;
        const profilePictureFile = req.file;

        if (!profilePictureFile) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        // Use FileUploader for cloudinary upload
        const uploadResult: any = await cloudinaryUploadBuffer(
            profilePictureFile.buffer,
            profilePictureFile.mimetype,
            'image'
        );

        const profilePictureUrl = uploadResult.secure_url;

        const newApplicant = new ApplicantModel({
            userId,
            profilePicture: profilePictureUrl,
            title,
            email,
            experience,
            education,
            portfolio,
            fullName,
        });

        await newApplicant.save();

        res.status(201).json({ message: 'Applicant created successfully', applicant: newApplicant });
    } catch (error: any) {
        console.error('Error creating applicant:', error);
        res.status(500).json({ message: 'Error creating applicant', error: error.message });
    }
});

const getResumesByEmail = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const resumes = await ResumeSchema.find({ email });
        res.status(200).json({ message: 'Resume data fetched successfully', data: resumes });
    } catch (error: any) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
});

const uploadCv = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { resumeName, userId, email } = req.body;
        const resume = req.file;

        if (!resume) {
            return res.status(400).json({ message: 'No resume file provided' });
        }

        const resumeSize = req.file!.size / 1024;
        let rSize = 0;

        if (resumeSize >= 1024) {
            rSize = resumeSize / 1024;
        } else {
            rSize = resumeSize;
        }

        const result: any = await cloudinaryUploadBuffer(
            resume.buffer,
            resume.mimetype,
            'raw'
        );

        const resumeUrl = result.secure_url;

        const saveCvData = new ResumeSchema({
            resumeName,
            userId,
            email,
            resumeUrl,
            size: rSize
        });

        const data = await saveCvData.save();
        res.status(201).json({ message: 'CV/Resume uploaded successfully', resume: data });
    } catch (error: any) {
        console.error('Error uploading CV:', error);
        res.status(500).json({ message: 'Error uploading CV', error: error.message });
    }
});

const getApplicantByEmail = asyncHandler(async (req: Request, res: Response) => {
    try {
        const applicant = await ApplicantModel.findOne({ email: req.params.email });
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        res.status(200).json(applicant);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching applicant', error: error.message });
    }
});

const postPersonalData = asyncHandler(async (req: Request, res: Response) => {
    const { country, biography, userId, email, dateOfBirth, gender, maritalStatus, education, experience } = req.body;
    try {
        if (!country || !biography || !dateOfBirth || !gender || !maritalStatus || !education || !experience) {
            return res.status(400).json({ message: 'Fill all data' });
        }
        const applicantPersonalData = new CandidatePersonalDataSchema({
            country,
            biography,
            dateOfBirth,
            gender,
            maritalStatus,
            education,
            experience,
            userId,
            email
        });
        const saveApplicantPersonalData = await applicantPersonalData.save();
        res.status(201).json({ message: 'personalData insert successfully', data: saveApplicantPersonalData });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching personal data', error: error.message });
    }
});

const updateNotification = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;
        const { shortlist, jobsExpire, jobAlerts, savedProfile, rejected } = req.body;

        const allowedFields = ['shortlist', 'jobsExpire', 'jobAlerts', 'savedProfile', 'rejected'];
        const updateData: any = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        console.log('Fields to update:', updateData);

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updatedNotification = await NotificationSchemas.updateOne(
            { userId: userId },
            {
                $set: updateData,
            },
            { runValidators: true }
        );

        console.log('Update result:', updatedNotification);

        if (updatedNotification.matchedCount === 0) {
            return res.status(404).json({ message: 'Notification not found for this userId' });
        }

        if (updatedNotification.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to notification' });
        }

        res.status(200).json({ message: 'Notification updated successfully', result: updatedNotification });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});

const getNotificationData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const findNotification = await NotificationSchemas.findOne({ userId: userId });
        res.status(200).json({ message: 'get notification data', result: findNotification })
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});

const updateJobAlerts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const jobAlertsData = req.body;
        const updateJobAlertsResult = await JobAlertSchemas.updateOne(
            { userId: userId },
            {
                $set: jobAlertsData
            },
            { runValidators: true }
        )

        if (updateJobAlertsResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to job alerts' });
        }
        res.status(200).json({ message: 'data modified success', data: updateJobAlertsResult })
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});

const getJobAlertsData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const jobAlertsFind = await JobAlertSchemas.findOne({ userId: userId })
        res.status(200).json({ message: 'data get successfully', data: jobAlertsFind })
    } catch (error: any) {
        console.error('data not found', error)
        res.status(500).json({ message: 'Error fetching job alerts', error: error.message });
    }
});

const updatePrivacy = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const privacy = req.body;
        const updatePrivacyResult = await ProfilePrivacySchemas.updateOne(
            { userId: userId },
            { $set: privacy },
            { runValidators: true }
        );
        if (updatePrivacyResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'Privacy mode not updated' });
        }
        res.status(200).json({ message: 'Updated data successfully', data: updatePrivacyResult });
    } catch (error: any) {
        console.error('Error updating privacy:', error);
        res.status(500).json({ message: 'Error updating privacy', error: error.message });
    }
});

const getProfilePrivacyData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const privacyDataFindByUser = await ProfilePrivacySchemas.findOne({ userId: userId });
        if (!privacyDataFindByUser) {
            return res.status(400).json({ message: 'data not found' })
        }
        res.status(200).json({ message: 'data get successfully', data: privacyDataFindByUser })
    } catch (error: any) {
        console.error('Error fetching privacy data:', error);
        res.status(500).json({ message: 'Error fetching privacy data', error: error.message });
    }
});

const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const _userId = new Types.ObjectId(userId as string);
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        // Find user by id and current password
        const user = await UserSchema.findOne({ _id: _userId, password: currentPassword });
        if (!user) {
            return res.status(400).json({ message: 'Current password does not match' });
        }

        // Update password
        const result = await UserSchema.updateOne(
            { _id: _userId },
            { $set: { password: newPassword } },
            { runValidators: true }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to password' });
        }

        res.status(200).json({ message: 'Password updated successfully', data: result });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
});

const getProfileComplete = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const profileData = await ApplicantModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $lookup: {
                    from: "personaldatas",
                    localField: "userId",
                    foreignField: "userId",
                    as: "personal",
                },
            },
            {
                $unwind: {
                    path: "$personal",
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
                    from: "socialmediainfos",
                    localField: "userId",
                    foreignField: "userId",
                    as: "socialMedia",
                },
            },
            {
                $unwind: {
                    path: "$socialMedia",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $set: {
                    social: "$socialMedia.socialLinks",
                    location: "$contact.mapLocation",
                    email: "$contact.email",
                    phoneNumber: "$contact.phoneNumber",
                    country: "$personal.country",
                    education: "$personal.education",
                    experience: "$personal.experience",
                    dateOfBirth: "$personal.dateOfBirth",
                    gender: "$personal.gender",
                    maritalStatus: "$personal.maritalStatus",
                    biography: "$personal.biography",
                },
            },
            {
                $addFields: {
                    message: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ["$social", null] },
                                    { $eq: ["$location", null] },
                                    { $eq: ["$email", null] },
                                    { $eq: ["$phoneNumber", null] },
                                    { $eq: ["$education", null] },
                                    { $eq: ["$experience", null] },
                                    { $eq: ["$dateOfBirth", null] },
                                    { $eq: ["$gender", null] },
                                    { $eq: ["$maritalStatus", null] },
                                    { $eq: ["$biography", null] },
                                ],
                            },
                            then: "Please!!! complete your profile",
                            else: "Profile is complete",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    social: 1,
                    location: 1,
                    email: 1,
                    phoneNumber: 1,
                    country: 1,
                    education: 1,
                    experience: 1,
                    dateOfBirth: 1,
                    gender: 1,
                    maritalStatus: 1,
                    biography: 1,
                    message: 1,
                },
            },
        ]);

        const result = profileData[0];

        if (!result) {
            return res.status(404).json({ message: 'User not found or no data available.' });
        }

        res.status(200).json({
            message: result.message,
            data: result,
        });

    } catch (error: any) {
        console.error('Error checking profile completeness:', error);
        res.status(500).json({ message: 'Error checking profile completeness', error: error.message });
    }
});

export {
    postApplicant,
    getResumesByEmail,
    uploadCv,
    getApplicantByEmail,
    postPersonalData,
    updateNotification,
    getNotificationData,
    updateJobAlerts,
    getJobAlertsData,
    updatePrivacy,
    getProfilePrivacyData,
    updatePassword,
    getProfileComplete
}
