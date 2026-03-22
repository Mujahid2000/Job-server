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
exports.applicantService = void 0;
const ApplicantModels_1 = __importDefault(require("../models/ApplicantModels"));
const ResumeSchema_1 = __importDefault(require("../models/ResumeSchema"));
const CandidatePersonalDataSchema_1 = __importDefault(require("../models/CandidatePersonalDataSchema"));
const UserModels_1 = __importDefault(require("../models/UserModels"));
const NotificationSchema_1 = __importDefault(require("../models/NotificationSchema"));
const JobAlertsSchema_1 = __importDefault(require("../models/JobAlertsSchema"));
const ProfilePrivacySchema_1 = __importDefault(require("../models/ProfilePrivacySchema"));
const mongoose_1 = require("mongoose");
const FileUploader_1 = require("../utils/FileUploader");
const ApiError_1 = require("../utils/ApiError");
const postApplicant = (applicantData, file) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadResult = yield (0, FileUploader_1.cloudinaryUploadBuffer)(file.buffer, file.mimetype, 'image');
    const newApplicant = new ApplicantModels_1.default(Object.assign(Object.assign({}, applicantData), { profilePicture: uploadResult.secure_url }));
    return yield newApplicant.save();
});
const getResumesByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ResumeSchema_1.default.find({ email });
});
const uploadCv = (cvData, file) => __awaiter(void 0, void 0, void 0, function* () {
    const resumeSize = file.size / 1024;
    const rSize = resumeSize >= 1024 ? resumeSize / 1024 : resumeSize;
    const result = yield (0, FileUploader_1.cloudinaryUploadBuffer)(file.buffer, file.mimetype, 'raw');
    const saveCvData = new ResumeSchema_1.default(Object.assign(Object.assign({}, cvData), { resumeUrl: result.secure_url, size: rSize }));
    return yield saveCvData.save();
});
const getApplicantByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const applicant = yield ApplicantModels_1.default.findOne({ email });
    if (!applicant) {
        throw new ApiError_1.ApiError(404, 'Applicant not found');
    }
    return applicant;
});
const postPersonalData = (personalData) => __awaiter(void 0, void 0, void 0, function* () {
    const applicantPersonalData = new CandidatePersonalDataSchema_1.default(personalData);
    return yield applicantPersonalData.save();
});
const updateNotification = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield NotificationSchema_1.default.updateOne({ userId }, { $set: updateData }, { runValidators: true });
    if (updatedNotification.matchedCount === 0) {
        throw new ApiError_1.ApiError(404, 'Notification not found for this userId');
    }
    return updatedNotification;
});
const getNotificationData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield NotificationSchema_1.default.findOne({ userId });
});
const updateJobAlerts = (userId, alertData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield JobAlertsSchema_1.default.updateOne({ userId }, { $set: alertData }, { runValidators: true });
    return result;
});
const getJobAlertsData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield JobAlertsSchema_1.default.findOne({ userId });
});
const updatePrivacy = (userId, privacyData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ProfilePrivacySchema_1.default.updateOne({ userId }, { $set: privacyData }, { runValidators: true });
    return result;
});
const getProfilePrivacyData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ProfilePrivacySchema_1.default.findOne({ userId });
});
const updatePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const _userId = new mongoose_1.Types.ObjectId(userId);
    const user = yield UserModels_1.default.findOne({ _id: _userId, password: currentPassword });
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Current password does not match');
    }
    const result = yield UserModels_1.default.updateOne({ _id: _userId }, { $set: { password: newPassword } }, { runValidators: true });
    return result;
});
const getProfileComplete = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const profileData = yield ApplicantModels_1.default.aggregate([
        { $match: { userId } },
        {
            $lookup: {
                from: "personaldatas",
                localField: "userId",
                foreignField: "userId",
                as: "personal",
            },
        },
        { $unwind: { path: "$personal", preserveNullAndEmptyArrays: true } },
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
                from: "socialmediainfos",
                localField: "userId",
                foreignField: "userId",
                as: "socialMedia",
            },
        },
        { $unwind: { path: "$socialMedia", preserveNullAndEmptyArrays: true } },
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
        throw new ApiError_1.ApiError(404, 'User not found or no data available.');
    }
    return result;
});
exports.applicantService = {
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
    getProfileComplete,
};
