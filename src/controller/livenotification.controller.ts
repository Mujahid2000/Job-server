import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { io }: any = req;
    const { type } = req.body;
    const notification = await notificationService.sendNotification(req.body, io);

    if (!notification) {
        return res.status(200).json(
            new ApiResponse(200, null, `Notification not sent: User is not eligible for ${type}`)
        );
    }

    res.status(200).json(
        new ApiResponse(200, notification, 'Notification sent successfully')
    );
});

const customerMessage = asyncHandler(async (req: Request, res: Response) => {
    const { io }: any = req;
    console.log(req)
    const msgData = await notificationService.customerMessage(req.body, io);

    res.status(200).json(
        new ApiResponse(200, msgData, 'Message sent successfully')
    );
});

export {
    sendNotification,
    customerMessage
};
