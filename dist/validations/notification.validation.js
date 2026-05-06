"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationValidation = void 0;
const zod_1 = require("zod");
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
const getParamsSenderId = zod_1.z.object({
    params: zod_1.z.object({
        senderId: zod_1.z.string().min(1),
    }),
});
const getParamsCustomerId = zod_1.z.object({
    params: zod_1.z.object({
        customerId: zod_1.z.string().min(1),
    }),
});
const getQueryAdminUserId = zod_1.z.object({
    query: zod_1.z.object({
        adminId: zod_1.z.string().min(1),
        userid: zod_1.z.string().min(1),
    }),
});
const postNotification = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1),
        companyUser: zod_1.z.string().min(1),
        applicantId: zod_1.z.string().min(1),
        jobId: zod_1.z.string().min(1),
        message: zod_1.z.string().min(1),
        Name: zod_1.z.string().optional(),
        type: zod_1.z.enum(['shortlist', 'savedProfile']).optional(),
    }),
});
const postCustomerMessage = zod_1.z.object({
    body: zod_1.z.object({
        senderId: zod_1.z.string().min(1),
        role: zod_1.z.string().min(1),
        message: zod_1.z.string().min(1),
        id: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(1),
        isAdmin: zod_1.z.boolean().optional(),
        receiverId: zod_1.z.string().min(1),
        isRead: zod_1.z.boolean().optional(),
    }),
});
exports.notificationValidation = {
    getParamsUserId,
    getParamsSenderId,
    getParamsCustomerId,
    getQueryAdminUserId,
    postNotification,
    postCustomerMessage,
};
