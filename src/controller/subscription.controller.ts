import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import PaymentSchema from "../models/PaymentModels";
import Payment from "../models/PaymentModels";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const getSubscriptionDataByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const payments = await PaymentSchema.find({ email: email });
        if (payments.length === 0) {
            throw new ApiError(404, 'No payments found for this email');
        }
        res.status(200).json(
            new ApiResponse(200, payments, 'Payments fetched successfully')
        );
    } catch (error: any) {
        console.error('Error fetching payments:', error);
        throw new ApiError(500, 'Internal server error', [error.message]);
    }
})

const getSubscriptionDataById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const payment = await Payment.find({ userId: id }); // Replace 'paymentId' with your custom field name
        if (!payment) {
            throw new ApiError(404, 'Payment not found');
        }
        res.status(200).json(
            new ApiResponse(200, payment, 'Payment fetched successfully')
        );
    } catch (error: any) {
        console.error('Error fetching payment by id:', error);
        throw new ApiError(500, 'Internal server error', [error.message]);
    }
})

export { getSubscriptionDataByEmail, getSubscriptionDataById }