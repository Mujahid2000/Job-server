"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplicationValidation = void 0;
const zod_1 = require("zod");
const postJobApplication = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'userId is required'),
        companyId: zod_1.z.string().min(1, 'companyId is required'),
        title: zod_1.z.string().min(1, 'title is required'),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        jobRole: zod_1.z.string().min(1, 'jobRole is required'),
        salaryType: zod_1.z.string().min(1, 'salaryType is required'),
        minSalary: zod_1.z.coerce.number().min(0),
        maxSalary: zod_1.z.coerce.number().min(0),
        education: zod_1.z.string().min(1, 'education is required'),
        experience: zod_1.z.string().min(1, 'experience is required'),
        jobType: zod_1.z.string().min(1, 'jobType is required'),
        expiryDate: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
        vacancies: zod_1.z.string().min(1, 'vacancies is required'),
        jobLevel: zod_1.z.string().min(1, 'jobLevel is required'),
        biography: zod_1.z.string().min(1, 'biography is required'),
        responsibilities: zod_1.z.string().min(1, 'responsibilities is required'),
        applyMethod: zod_1.z.string().min(1, 'applyMethod is required'),
        location: zod_1.z.string().min(1, 'location is required'),
    }),
});
const postPromotedJobs = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        jobId: zod_1.z.string().min(1),
        companyId: zod_1.z.string().min(1),
        promotedSystem: zod_1.z.string().min(1),
    }),
});
const bookmarkJobPost = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        companyId: zod_1.z.string().min(1),
        jobId: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
    }),
});
const getParamsId = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
const getParamsEmail = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
const getParamsCompanyId = zod_1.z.object({
    params: zod_1.z.object({
        companyId: zod_1.z.string().min(1),
    }),
});
exports.jobApplicationValidation = {
    postJobApplication,
    postPromotedJobs,
    bookmarkJobPost,
    getParamsId,
    getParamsEmail,
    getParamsCompanyId,
};
