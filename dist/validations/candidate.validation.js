"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateValidation = void 0;
const zod_1 = require("zod");
const getParamsUserId = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().min(1),
    }),
});
const getParamsEmail = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
exports.candidateValidation = {
    getParamsUserId,
    getParamsEmail,
};
