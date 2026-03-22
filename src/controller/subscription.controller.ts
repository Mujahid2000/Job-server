import { Request, Response } from "express";
import { subscriptionService } from "../services/subscription.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const getSubscriptionDataByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params;
    const result = await subscriptionService.getSubscriptionDataByEmail(email as string);
    res.status(200).json(
        new ApiResponse(200, result, 'Payments fetched successfully')
    );
});

const getSubscriptionDataById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await subscriptionService.getSubscriptionDataById(id as string);
    res.status(200).json(
        new ApiResponse(200, result, 'Payment fetched successfully')
    );
});

export { getSubscriptionDataByEmail, getSubscriptionDataById }