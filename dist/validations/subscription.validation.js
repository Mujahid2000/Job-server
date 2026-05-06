"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionValidation = void 0;
const zod_1 = require("zod");
const getParamsEmail = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
});
const getParamsId = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
exports.subscriptionValidation = {
    getParamsEmail,
    getParamsId,
};
