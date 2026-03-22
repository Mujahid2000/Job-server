import { z } from 'zod';

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

const getParamsEmail = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});

export const candidateValidation = {
  getParamsUserId,
  getParamsEmail,
};
