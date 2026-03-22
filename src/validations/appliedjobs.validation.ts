import { z } from 'zod';

const postJobAppliced = z.object({
  body: z.object({
    userId: z.string().min(1, 'userId is required'),
    email: z.string().email('Invalid email address'),
    jobId: z.string().min(1, 'jobId is required'),
    resume_Id: z.string().min(1, 'resume_Id is required'),
    coverLetter: z.string().min(1, 'coverLetter is required'),
  }),
});

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

const getParamsJobId = z.object({
  params: z.object({
    jobId: z.string().min(1),
  }),
});

const getApplicantDetails = z.object({
  query: z.object({
    userId: z.string().min(1),
    resumeId: z.string().min(1),
  }),
});

export const appliedJobsValidation = {
  postJobAppliced,
  getParamsUserId,
  getParamsJobId,
  getApplicantDetails,
};
