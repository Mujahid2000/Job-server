"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortListedValidation = void 0;
const zod_1 = require("zod");
const postShortListedData = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        jobId: zod_1.z.string().min(1),
        resumeId: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        applicantId: zod_1.z.string().min(1),
    }),
});
const getParamsJobId = zod_1.z.object({
    params: zod_1.z.object({
        jobId: zod_1.z.string().min(1),
    }),
});
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
const getParamsId = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
const getQueryUserIdResumeId = zod_1.z.object({
    query: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        resumeId: zod_1.z.string().min(1),
    }),
});
const getQueryUserId = zod_1.z.object({
    query: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
const postSaveCandidateProfile = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        applicantId: zod_1.z.string().min(1),
    }),
});
exports.shortListedValidation = {
    postShortListedData,
    getParamsJobId,
    getParamsUserId,
    getParamsId,
    getQueryUserIdResumeId,
    getQueryUserId,
    postSaveCandidateProfile,
};
