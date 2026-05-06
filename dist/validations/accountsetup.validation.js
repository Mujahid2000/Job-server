"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountSetupValidation = void 0;
const zod_1 = require("zod");
const postCompanyData = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        companyName: zod_1.z.string().min(1),
        biography: zod_1.z.string().min(1),
    }),
});
const postFounderInfo = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        organizationType: zod_1.z.string().min(1),
        industryTypes: zod_1.z.string().min(1),
        teamSize: zod_1.z.string().min(1),
        yearEstablished: zod_1.z.string().min(1),
        companyWebsite: zod_1.z.string().url().or(zod_1.z.string().length(0)),
        companyVision: zod_1.z.string().min(1),
    }),
});
const postContactInfo = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        phoneNumber: zod_1.z.coerce.number(),
        email: zod_1.z.string().email(),
        mapLocation: zod_1.z.string().min(1),
    }),
});
const postSocialMedia = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        socialLinks: zod_1.z.array(zod_1.z.object({
            platform: zod_1.z.string().min(1),
            url: zod_1.z.string().url(),
        })),
    }),
});
exports.accountSetupValidation = {
    postCompanyData,
    postFounderInfo,
    postContactInfo,
    postSocialMedia,
};
