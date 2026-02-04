import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import PaymentSchema from "../models/PaymentModels";
import Payment from "../models/PaymentModels";

const getSubscriptionDataByEmail = asyncHandler(async (req: Request, res:Response) =>{
    const { email } = req.params;
        try {
            const payments = await PaymentSchema.find({ email: email });
            if (payments.length === 0) {
                return res.status(404).json({ message: 'No payments found for this email' });
            }
            res.status(200).json(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
})

const getSubscriptionDataById = asyncHandler(async (req: Request, res:Response) =>{
    const { id } = req.params;

    try {
        const payment = await Payment.find({ userId: id }); // Replace 'paymentId' with your custom field name
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export { getSubscriptionDataByEmail, getSubscriptionDataById }