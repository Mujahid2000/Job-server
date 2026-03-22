import { z } from 'zod';

const postPaypalOrderCreate = z.object({
  body: z.object({
    price: z.number().positive(),
    userId: z.string().min(1),
    packageName: z.string().min(1),
    duration: z.string().min(1),
    currency: z.string().optional(),
  }),
});

const postPaypalOrderCapture = z.object({
  body: z.object({
    orderID: z.string().min(1),
    userId: z.string().min(1),
    packageName: z.string().min(1),
    duration: z.string().min(1),
  }),
});

export const paypalValidation = {
  postPaypalOrderCreate,
  postPaypalOrderCapture,
};
