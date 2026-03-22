import { z } from 'zod';

const postJobApplication = z.object({
  body: z.object({
    userId: z.string().min(1, 'userId is required'),
    companyId: z.string().min(1, 'companyId is required'),
    title: z.string().min(1, 'title is required'),
    tags: z.array(z.string()).optional(),
    jobRole: z.string().min(1, 'jobRole is required'),
    salaryType: z.string().min(1, 'salaryType is required'),
    minSalary: z.coerce.number().min(0),
    maxSalary: z.coerce.number().min(0),
    education: z.string().min(1, 'education is required'),
    experience: z.string().min(1, 'experience is required'),
    jobType: z.string().min(1, 'jobType is required'),
    expiryDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    vacancies: z.string().min(1, 'vacancies is required'),
    jobLevel: z.string().min(1, 'jobLevel is required'),
    biography: z.string().min(1, 'biography is required'),
    responsibilities: z.string().min(1, 'responsibilities is required'),
    applyMethod: z.string().min(1, 'applyMethod is required'),
    location: z.string().min(1, 'location is required'),
  }),
});

const postPromotedJobs = z.object({
  body: z.object({
    userId: z.string().min(1),
    jobId: z.string().min(1),
    companyId: z.string().min(1),
    promotedSystem: z.string().min(1),
  }),
});

const bookmarkJobPost = z.object({
  body: z.object({
    userId: z.string().min(1),
    companyId: z.string().min(1),
    jobId: z.string().min(1),
    email: z.string().email(),
  }),
});

const getParamsId = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const getParamsEmail = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});

const getParamsCompanyId = z.object({
  params: z.object({
    companyId: z.string().min(1),
  }),
});

export const jobApplicationValidation = {
  postJobApplication,
  postPromotedJobs,
  bookmarkJobPost,
  getParamsId,
  getParamsEmail,
  getParamsCompanyId,
};
