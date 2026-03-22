import { z } from 'zod';

const getParamsEmail = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});

const getParamsId = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const subscriptionValidation = {
  getParamsEmail,
  getParamsId,
};
