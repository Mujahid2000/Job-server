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
exports.getProfileComplete = exports.updatePassword = exports.getProfilePrivacyData = exports.updatePrivacy = exports.getJobAlertsData = exports.updateJobAlerts = exports.getNotificationData = exports.updateNotification = exports.postPersonalData = exports.getApplicantByEmail = exports.uploadCv = exports.getResumesByEmail = exports.postApplicant = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApplicantModels_1 = __importDefault(require("../models/ApplicantModels"));
const ResumeSchema_1 = __importDefault(require("../models/ResumeSchema"));
const CandidatePersonalDataSchema_1 = __importDefault(require("../models/CandidatePersonalDataSchema"));
const UserModels_1 = __importDefault(require("../models/UserModels"));
const NotificationSchema_1 = __importDefault(require("../models/NotificationSchema"));
const JobAlertsSchema_1 = __importDefault(require("../models/JobAlertsSchema"));
const ProfilePrivacySchema_1 = __importDefault(require("../models/ProfilePrivacySchema"));
const mongoose_1 = require("mongoose");
const FileUploader_1 = require("../utils/FileUploader");
const postApplicant = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, email, experience, education, portfolio, fullName } = req.body;
        const profilePictureFile = req.file;
        if (!profilePictureFile) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        // Use FileUploader for cloudinary upload
        const uploadResult = yield (0, FileUploader_1.cloudinaryUploadBuffer)(profilePictureFile.buffer, profilePictureFile.mimetype, 'image');
        const profilePictureUrl = uploadResult.secure_url;
        const newApplicant = new ApplicantModels_1.default({
            userId,
            profilePicture: profilePictureUrl,
            title,
            email,
            experience,
            education,
            portfolio,
            fullName,
        });
        yield newApplicant.save();
        res.status(201).json({ message: 'Applicant created successfully', applicant: newApplicant });
    }
    catch (error) {
        console.error('Error creating applicant:', error);
        res.status(500).json({ message: 'Error creating applicant', error: error.message });
    }
}));
exports.postApplicant = postApplicant;
const getResumesByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const resumes = yield ResumeSchema_1.default.find({ email });
        res.status(200).json({ message: 'Resume data fetched successfully', data: resumes });
    }
    catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
}));
exports.getResumesByEmail = getResumesByEmail;
const uploadCv = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resumeName, userId, email } = req.body;
        const resume = req.file;
        if (!resume) {
            return res.status(400).json({ message: 'No resume file provided' });
        }
        const resumeSize = req.file.size / 1024;
        let rSize = 0;
        if (resumeSize >= 1024) {
            rSize = resumeSize / 1024;
        }
        else {
            rSize = resumeSize;
        }
        const result = yield (0, FileUploader_1.cloudinaryUploadBuffer)(resume.buffer, resume.mimetype, 'raw');
        const resumeUrl = result.secure_url;
        const saveCvData = new ResumeSchema_1.default({
            resumeName,
            userId,
            email,
            resumeUrl,
            size: rSize
        });
        const data = yield saveCvData.save();
        res.status(201).json({ message: 'CV/Resume uploaded successfully', resume: data });
    }
    catch (error) {
        console.error('Error uploading CV:', error);
        res.status(500).json({ message: 'Error uploading CV', error: error.message });
    }
}));
exports.uploadCv = uploadCv;
const getApplicantByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicant = yield ApplicantModels_1.default.findOne({ email: req.params.email });
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        res.status(200).json(applicant);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching applicant', error: error.message });
    }
}));
exports.getApplicantByEmail = getApplicantByEmail;
const postPersonalData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, biography, userId, email, dateOfBirth, gender, maritalStatus, education, experience } = req.body;
    try {
        if (!country || !biography || !dateOfBirth || !gender || !maritalStatus || !education || !experience) {
            return res.status(400).json({ message: 'Fill all data' });
        }
        const applicantPersonalData = new CandidatePersonalDataSchema_1.default({
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
        const saveApplicantPersonalData = yield applicantPersonalData.save();
        res.status(201).json({ message: 'personalData insert successfully', data: saveApplicantPersonalData });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching personal data', error: error.message });
    }
}));
exports.postPersonalData = postPersonalData;
const updateNotification = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.params;
        const { shortlist, jobsExpire, jobAlerts, savedProfile, rejected } = req.body;
        const allowedFields = ['shortlist', 'jobsExpire', 'jobAlerts', 'savedProfile', 'rejected'];
        const updateData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }
        console.log('Fields to update:', updateData);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        const updatedNotification = yield NotificationSchema_1.default.updateOne({ userId: userId }, {
            $set: updateData,
        }, { runValidators: true });
        console.log('Update result:', updatedNotification);
        if (updatedNotification.matchedCount === 0) {
            return res.status(404).json({ message: 'Notification not found for this userId' });
        }
        if (updatedNotification.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to notification' });
        }
        res.status(200).json({ message: 'Notification updated successfully', result: updatedNotification });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
}));
exports.updateNotification = updateNotification;
const getNotificationData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const findNotification = yield NotificationSchema_1.default.findOne({ userId: userId });
        res.status(200).json({ message: 'get notification data', result: findNotification });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
}));
exports.getNotificationData = getNotificationData;
const updateJobAlerts = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const jobAlertsData = req.body;
        const updateJobAlertsResult = yield JobAlertsSchema_1.default.updateOne({ userId: userId }, {
            $set: jobAlertsData
        }, { runValidators: true });
        if (updateJobAlertsResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to job alerts' });
        }
        res.status(200).json({ message: 'data modified success', data: updateJobAlertsResult });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
}));
exports.updateJobAlerts = updateJobAlerts;
const getJobAlertsData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const jobAlertsFind = yield JobAlertsSchema_1.default.findOne({ userId: userId });
        res.status(200).json({ message: 'data get successfully', data: jobAlertsFind });
    }
    catch (error) {
        console.error('data not found', error);
        res.status(500).json({ message: 'Error fetching job alerts', error: error.message });
    }
}));
exports.getJobAlertsData = getJobAlertsData;
const updatePrivacy = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const privacy = req.body;
        const updatePrivacyResult = yield ProfilePrivacySchema_1.default.updateOne({ userId: userId }, { $set: privacy }, { runValidators: true });
        if (updatePrivacyResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'Privacy mode not updated' });
        }
        res.status(200).json({ message: 'Updated data successfully', data: updatePrivacyResult });
    }
    catch (error) {
        console.error('Error updating privacy:', error);
        res.status(500).json({ message: 'Error updating privacy', error: error.message });
    }
}));
exports.updatePrivacy = updatePrivacy;
const getProfilePrivacyData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const privacyDataFindByUser = yield ProfilePrivacySchema_1.default.findOne({ userId: userId });
        if (!privacyDataFindByUser) {
            return res.status(400).json({ message: 'data not found' });
        }
        res.status(200).json({ message: 'data get successfully', data: privacyDataFindByUser });
    }
    catch (error) {
        console.error('Error fetching privacy data:', error);
        res.status(500).json({ message: 'Error fetching privacy data', error: error.message });
    }
}));
exports.getProfilePrivacyData = getProfilePrivacyData;
const updatePassword = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const _userId = new mongoose_1.Types.ObjectId(userId);
        const { currentPassword, newPassword } = req.body;
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }
        // Find user by id and current password
        const user = yield UserModels_1.default.findOne({ _id: _userId, password: currentPassword });
        if (!user) {
            return res.status(400).json({ message: 'Current password does not match' });
        }
        // Update password
        const result = yield UserModels_1.default.updateOne({ _id: _userId }, { $set: { password: newPassword } }, { runValidators: true });
        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to password' });
        }
        res.status(200).json({ message: 'Password updated successfully', data: result });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
}));
exports.updatePassword = updatePassword;
const getProfileComplete = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log(userId);
        const profileData = yield ApplicantModels_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Error checking profile completeness:', error);
        res.status(500).json({ message: 'Error checking profile completeness', error: error.message });
    }
}));
exports.getProfileComplete = getProfileComplete;
