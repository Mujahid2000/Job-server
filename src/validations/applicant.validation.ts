import { z } from 'zod';

const postApplicant = z.object({
  body: z.object({
    userId: z.string().min(1),
    title: z.string().min(1),
    email: z.string().email(),
    experience: z.string().min(1),
    education: z.string().min(1),
    portfolio: z.string().url().optional().or(z.string().length(0)),
    fullName: z.string().min(1),
  }),
});

const uploadCv = z.object({
  body: z.object({
    resumeName: z.string().min(1),
    userId: z.string().min(1),
    email: z.string().email(),
  }),
});

const updateNotification = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    shortlist: z.boolean().optional(),
    jobsExpire: z.boolean().optional(),
    jobAlerts: z.boolean().optional(),
    savedProfile: z.boolean().optional(),
    rejected: z.boolean().optional(),
  }),
});

const updateJobAlerts = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
  body: z.object({
    jobRole: z.string().optional(),
    location: z.string().optional(),
  }),
});

const updatePrivacy = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
  body: z.object({
    profilePublic: z.boolean().optional(),
    resumePublic: z.boolean().optional(),
  }),
});

const updatePassword = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }),
});

const postPersonalData = z.object({
  body: z.object({
    country: z.string().min(1),
    biography: z.string().min(1),
    userId: z.string().min(1),
    email: z.string().email(),
    dateOfBirth: z.string().min(1),
    gender: z.string().min(1),
    maritalStatus: z.string().min(1),
    education: z.string().min(1),
    experience: z.string().min(1),
  }),
});

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

export const applicantValidation = {
  postApplicant,
  uploadCv,
  updateNotification,
  updateJobAlerts,
  updatePrivacy,
  updatePassword,
  postPersonalData,
  getParamsUserId,
};
