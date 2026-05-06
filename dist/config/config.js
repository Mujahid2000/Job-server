"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    MONGO_URI: zod_1.z.string().url(),
    POSTGRES_URL: zod_1.z.string().url(),
    SECRET_TOKEN: zod_1.z.string(),
    ACCESS_TOKEN_EXPIRY: zod_1.z.string().default('1d'),
    REFRESH_TOKEN_SECRET: zod_1.z.string(),
    REFRESH_TOKEN_EXPIRY: zod_1.z.string().default('10d'),
    FRONTEND_URL: zod_1.z.string().url().optional(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1),
    PAYPAL_CLIENT_ID: zod_1.z.string().min(1),
    PAYPAL_CLIENT_SECRET: zod_1.z.string().min(1),
    EMAIL_HOST: zod_1.z.string().default('smtp.gmail.com'),
    EMAIL_PORT: zod_1.z.string().default('465'),
    EMAIL_USER: zod_1.z.string().email().optional(),
    EMAIL_PASS: zod_1.z.string().optional(),
});
const envVars = envSchema.safeParse(process.env);
if (!envVars.success) {
    console.error('❌ Invalid environment variables:', envVars.error.format());
    process.exit(1);
}
exports.config = {
    env: envVars.data.NODE_ENV,
    port: parseInt(envVars.data.PORT, 10),
    mongoose: {
        url: envVars.data.MONGO_URI,
    },
    postgres: {
        url: envVars.data.POSTGRES_URL,
    },
    jwt: {
        secret: envVars.data.SECRET_TOKEN,
        accessExpiration: envVars.data.ACCESS_TOKEN_EXPIRY,
        refreshSecret: envVars.data.REFRESH_TOKEN_SECRET,
        refreshExpiration: envVars.data.REFRESH_TOKEN_EXPIRY,
    },
    frontendUrl: envVars.data.FRONTEND_URL,
    cloudinary: {
        cloudName: envVars.data.CLOUDINARY_CLOUD_NAME,
        apiKey: envVars.data.CLOUDINARY_API_KEY,
        apiSecret: envVars.data.CLOUDINARY_API_SECRET,
    },
    paypal: {
        clientId: envVars.data.PAYPAL_CLIENT_ID,
        clientSecret: envVars.data.PAYPAL_CLIENT_SECRET,
    },
    email: {
        host: envVars.data.EMAIL_HOST,
        port: parseInt(envVars.data.EMAIL_PORT, 10),
        user: envVars.data.EMAIL_USER,
        pass: envVars.data.EMAIL_PASS,
    },
};
