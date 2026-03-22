import { z } from 'zod';

const postTag = z.object({
  body: z.object({
    tagName: z.string().min(1),
  }),
});

export const tagValidation = {
  postTag,
};
