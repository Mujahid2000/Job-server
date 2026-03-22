import { z } from 'zod';

const getParamsId = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

export const companyValidation = {
  getParamsId,
  getParamsUserId,
};
