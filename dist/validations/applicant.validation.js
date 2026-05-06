"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicantValidation = void 0;
const zod_1 = require("zod");
const postApplicant = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        title: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        experience: zod_1.z.string().min(1),
        education: zod_1.z.string().min(1),
        portfolio: zod_1.z.string().url().optional().or(zod_1.z.string().length(0)),
        fullName: zod_1.z.string().min(1),
    }),
});
const uploadCv = zod_1.z.object({
    body: zod_1.z.object({
        resumeName: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
    }),
});
const updateNotification = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
    body: zod_1.z.object({
        shortlist: zod_1.z.boolean().optional(),
        jobsExpire: zod_1.z.boolean().optional(),
        jobAlerts: zod_1.z.boolean().optional(),
        savedProfile: zod_1.z.boolean().optional(),
        rejected: zod_1.z.boolean().optional(),
    }),
});
const updateJobAlerts = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
    body: zod_1.z.object({
        jobRole: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
    }),
});
const updatePrivacy = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
    body: zod_1.z.object({
        profilePublic: zod_1.z.boolean().optional(),
        resumePublic: zod_1.z.boolean().optional(),
    }),
});
const updatePassword = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1),
        newPassword: zod_1.z.string().min(6),
    }),
});
const postPersonalData = zod_1.z.object({
    body: zod_1.z.object({
        country: zod_1.z.string().min(1),
        biography: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        dateOfBirth: zod_1.z.string().min(1),
        gender: zod_1.z.string().min(1),
        maritalStatus: zod_1.z.string().min(1),
        education: zod_1.z.string().min(1),
        experience: zod_1.z.string().min(1),
    }),
});
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
exports.applicantValidation = {
    postApplicant,
    uploadCv,
    updateNotification,
    updateJobAlerts,
    updatePrivacy,
    updatePassword,
    postPersonalData,
    getParamsUserId,
};
