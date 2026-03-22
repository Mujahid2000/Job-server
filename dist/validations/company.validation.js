"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyValidation = void 0;
const zod_1 = require("zod");
const getParamsId = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
exports.companyValidation = {
    getParamsId,
    getParamsUserId,
};
