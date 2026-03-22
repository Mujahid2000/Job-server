import { z } from 'zod';

const postCompanyData = z.object({
  body: z.object({
    userId: z.string().min(1),
    companyName: z.string().min(1),
    biography: z.string().min(1),
  }),
});

const postFounderInfo = z.object({
  body: z.object({
    userId: z.string().min(1),
    organizationType: z.string().min(1),
    industryTypes: z.string().min(1),
    teamSize: z.string().min(1),
    yearEstablished: z.string().min(1),
    companyWebsite: z.string().url().or(z.string().length(0)),
    companyVision: z.string().min(1),
  }),
});

const postContactInfo = z.object({
  body: z.object({
    userId: z.string().min(1),
    phoneNumber: z.coerce.number(),
    email: z.string().email(),
    mapLocation: z.string().min(1),
  }),
});

const postSocialMedia = z.object({
  body: z.object({
    userId: z.string().min(1),
    socialLinks: z.array(z.object({
      platform: z.string().min(1),
      url: z.string().url(),
    })),
  }),
});

export const accountSetupValidation = {
  postCompanyData,
  postFounderInfo,
  postContactInfo,
  postSocialMedia,
};
