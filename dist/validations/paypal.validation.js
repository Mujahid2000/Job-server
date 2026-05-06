"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalValidation = void 0;
const zod_1 = require("zod");
const postPaypalOrderCreate = zod_1.z.object({
    body: zod_1.z.object({
        price: zod_1.z.number().positive(),
        userId: zod_1.z.string().min(1),
        packageName: zod_1.z.string().min(1),
        duration: zod_1.z.string().min(1),
        currency: zod_1.z.string().optional(),
    }),
});
const postPaypalOrderCapture = zod_1.z.object({
    body: zod_1.z.object({
        orderID: zod_1.z.string().min(1),
        userId: zod_1.z.string().min(1),
        packageName: zod_1.z.string().min(1),
        duration: zod_1.z.string().min(1),
    }),
});
exports.paypalValidation = {
    postPaypalOrderCreate,
    postPaypalOrderCapture,
};
