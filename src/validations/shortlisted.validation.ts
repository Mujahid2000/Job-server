import { z } from 'zod';

const postShortListedData = z.object({
  body: z.object({
    userId: z.string().min(1),
    jobId: z.string().min(1),
    resumeId: z.string().min(1),
    email: z.string().email(),
    applicantId: z.string().min(1),
  }),
});

const getParamsJobId = z.object({
  params: z.object({
    jobId: z.string().min(1),
  }),
});

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

const getParamsId = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const getQueryUserIdResumeId = z.object({
  query: z.object({
    userId: z.string().min(1),
    resumeId: z.string().min(1),
  }),
});

const getQueryUserId = z.object({
  query: z.object({
    userId: z.string().min(1),
  }),
});

const postSaveCandidateProfile = z.object({
  body: z.object({
    userId: z.string().min(1),
    applicantId: z.string().min(1),
  }),
});

export const shortListedValidation = {
  postShortListedData,
  getParamsJobId,
  getParamsUserId,
  getParamsId,
  getQueryUserIdResumeId,
  getQueryUserId,
  postSaveCandidateProfile,
};
