import { z } from 'zod';

const registerUser = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().min(1, 'Role is required'),
    phoneNumber: z.coerce.number().optional(),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const getUserByEmail = z.object({
  params: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const userValidation = {
  registerUser,
  loginUser,
  getUserByEmail,
};
