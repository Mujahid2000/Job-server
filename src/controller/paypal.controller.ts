import { Request, Response } from "express";
import { paypalService } from "../services/paypal.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const payparOrderCreate = asyncHandler(async (req: Request, res: Response) => {
    const result = await paypalService.createOrder(req.body);
    res.status(200).json(
        new ApiResponse(200, result, 'Order created successfully')
    );
});

const payparOrderCapture = asyncHandler(async (req: Request, res: Response) => {
    const result = await paypalService.captureOrder(req.body);
    res.status(200).json(
        new ApiResponse(200, result, 'Order captured and payment saved successfully')
    );
});

export {
    payparOrderCreate,
    payparOrderCapture
};