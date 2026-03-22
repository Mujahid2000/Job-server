import ApplicantModel from "../models/ApplicantModels";
import ResumeSchema from "../models/ResumeSchema";
import CandidatePersonalDataSchema from "../models/CandidatePersonalDataSchema";
import UserSchema from "../models/UserModels";
import NotificationSchemas from "../models/NotificationSchema";
import JobAlertSchemas from "../models/JobAlertsSchema";
import ProfilePrivacySchemas from "../models/ProfilePrivacySchema";
import { Types } from "mongoose";
import { cloudinaryUploadBuffer } from "../utils/FileUploader";
import { ApiError } from "../utils/ApiError";

const postApplicant = async (applicantData: any, file: Express.Multer.File) => {
  const uploadResult: any = await cloudinaryUploadBuffer(
    file.buffer,
    file.mimetype,
    'image'
  );

  const newApplicant = new ApplicantModel({
    ...applicantData,
    profilePicture: uploadResult.secure_url,
  });

  return await newApplicant.save();
};

const getResumesByEmail = async (email: string) => {
  return await ResumeSchema.find({ email });
};

const uploadCv = async (cvData: any, file: Express.Multer.File) => {
  const resumeSize = file.size / 1024;
  const rSize = resumeSize >= 1024 ? resumeSize / 1024 : resumeSize;

  const result: any = await cloudinaryUploadBuffer(
    file.buffer,
    file.mimetype,
    'raw'
  );

  const saveCvData = new ResumeSchema({
    ...cvData,
    resumeUrl: result.secure_url,
    size: rSize
  });

  return await saveCvData.save();
};

const getApplicantByEmail = async (email: string) => {
  const applicant = await ApplicantModel.findOne({ email });
  if (!applicant) {
    throw new ApiError(404, 'Applicant not found');
  }
  return applicant;
};

const postPersonalData = async (personalData: any) => {
  const applicantPersonalData = new CandidatePersonalDataSchema(personalData);
  return await applicantPersonalData.save();
};

const updateNotification = async (userId: string, updateData: any) => {
  const updatedNotification = await NotificationSchemas.updateOne(
    { userId },
    { $set: updateData },
    { runValidators: true }
  );

  if (updatedNotification.matchedCount === 0) {
    throw new ApiError(404, 'Notification not found for this userId');
  }

  return updatedNotification;
};

const getNotificationData = async (userId: string) => {
  return await NotificationSchemas.findOne({ userId });
};

const updateJobAlerts = async (userId: string, alertData: any) => {
  const result = await JobAlertSchemas.updateOne(
    { userId },
    { $set: alertData },
    { runValidators: true }
  );
  return result;
};

const getJobAlertsData = async (userId: string) => {
  return await JobAlertSchemas.findOne({ userId });
};

const updatePrivacy = async (userId: string, privacyData: any) => {
  const result = await ProfilePrivacySchemas.updateOne(
    { userId },
    { $set: privacyData },
    { runValidators: true }
  );
  return result;
};

const getProfilePrivacyData = async (userId: string) => {
  return await ProfilePrivacySchemas.findOne({ userId });
};

const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const _userId = new Types.ObjectId(userId);
  const user = await UserSchema.findOne({ _id: _userId, password: currentPassword });
  if (!user) {
    throw new ApiError(400, 'Current password does not match');
  }

  const result = await UserSchema.updateOne(
    { _id: _userId },
    { $set: { password: newPassword } },
    { runValidators: true }
  );

  return result;
};

const getProfileComplete = async (userId: string) => {
  const profileData = await ApplicantModel.aggregate([
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
    throw new ApiError(404, 'User not found or no data available.');
  }
  return result;
};

export const applicantService = {
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
