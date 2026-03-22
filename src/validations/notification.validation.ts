import { z } from 'zod';

const getParamsUserId = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

const getParamsSenderId = z.object({
  params: z.object({
    senderId: z.string().min(1),
  }),
});

const getParamsCustomerId = z.object({
  params: z.object({
    customerId: z.string().min(1),
  }),
});

const getQueryAdminUserId = z.object({
  query: z.object({
    adminId: z.string().min(1),
    userid: z.string().min(1),
  }),
});

const postNotification = z.object({
  body: z.object({
    id: z.string().min(1),
    companyUser: z.string().min(1),
    applicantId: z.string().min(1),
    jobId: z.string().min(1),
    message: z.string().min(1),
    Name: z.string().optional(),
    type: z.enum(['shortlist', 'savedProfile']).optional(),
  }),
});

const postCustomerMessage = z.object({
  body: z.object({
    senderId: z.string().min(1),
    role: z.string().min(1),
    message: z.string().min(1),
    id: z.string().min(1),
    email: z.string().email(),
    name: z.string().min(1),
    isAdmin: z.boolean().optional(),
    receiverId: z.string().min(1),
    isRead: z.boolean().optional(),
  }),
});

export const notificationValidation = {
  getParamsUserId,
  getParamsSenderId,
  getParamsCustomerId,
  getQueryAdminUserId,
  postNotification,
  postCustomerMessage,
};
