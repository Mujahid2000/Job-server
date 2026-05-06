"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const registerUser = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.string().min(1, 'Role is required'),
        phoneNumber: zod_1.z.coerce.number().optional(),
    }),
});
const loginUser = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
const getUserByEmail = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
exports.userValidation = {
    registerUser,
    loginUser,
    getUserByEmail,
};
