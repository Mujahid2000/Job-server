import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().url(),
  POSTGRES_URL: z.string().url(),
  SECRET_TOKEN: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string().default('1d'),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string().default('10d'),
  FRONTEND_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  PAYPAL_CLIENT_ID: z.string().min(1),
  PAYPAL_CLIENT_SECRET: z.string().min(1),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error('❌ Invalid environment variables:', envVars.error.format());
  process.exit(1);
}

export const config = {
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
};
