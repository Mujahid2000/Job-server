"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appliedJobsValidation = void 0;
const zod_1 = require("zod");
const postJobAppliced = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'userId is required'),
        email: zod_1.z.string().email('Invalid email address'),
        jobId: zod_1.z.string().min(1, 'jobId is required'),
        resume_Id: zod_1.z.string().min(1, 'resume_Id is required'),
        coverLetter: zod_1.z.string().min(1, 'coverLetter is required'),
    }),
});
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
const getParamsJobId = zod_1.z.object({
    params: zod_1.z.object({
        jobId: zod_1.z.string().min(1),
    }),
});
const getApplicantDetails = zod_1.z.object({
    query: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        resumeId: zod_1.z.string().min(1),
    }),
});
exports.appliedJobsValidation = {
    postJobAppliced,
    getParamsUserId,
    getParamsJobId,
    getApplicantDetails,
};
