import PaymentSchema from "../models/PaymentModels";
import { ApiError } from "../utils/ApiError";

const getSubscriptionDataByEmail = async (email: string) => {
    const payments = await PaymentSchema.find({ email });
    if (payments.length === 0) {
        throw new ApiError(404, 'No payments found for this email');
    }
    return payments;
};

const getSubscriptionDataById = async (userId: string) => {
    const payments = await PaymentSchema.find({ userId });
    if (payments.length === 0) {
        throw new ApiError(404, 'No payments found for this user');
    }
    return payments;
};

export const subscriptionService = {
    getSubscriptionDataByEmail,
    getSubscriptionDataById,
};
