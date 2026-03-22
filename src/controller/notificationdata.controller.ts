import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

const getNotificationData = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const notifications = await notificationService.getNotificationData(userId as string);
    if (!notifications || notifications.length === 0) {
        throw new ApiError(404, 'No notifications found');
    }
    res.status(200).json(
        new ApiResponse(200, notifications, 'Notification data retrieved')
    );
});

const sendNotificationCustomerProfile = asyncHandler(async (req: Request, res: Response) => {
    const { senderId } = req.params;
    const profiles = await notificationService.getCustomerProfilesForAdmin(senderId as string);
    if (!profiles || profiles.length === 0) {
        throw new ApiError(404, 'No profiles found');
    }
    res.status(200).json(
        new ApiResponse(200, profiles, 'Profiles fetched successfully')
    );
});

const customerMessageForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const customerMessage = await notificationService.getCustomerMessagesForAdmin(customerId as string);
    if (!customerMessage || customerMessage.length === 0) {
        throw new ApiError(404, 'No message found');
    }
    res.status(200).json(
        new ApiResponse(200, customerMessage, 'Found messages')
    );
});

const adminMessageForCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { adminId, userid } = req.query;
    const adminMessage = await notificationService.getAdminMessagesForCustomer(adminId as string, userid as string);
    if (!adminMessage || adminMessage.length === 0) {
        throw new ApiError(404, 'Messages Data not found');
    }
    res.status(200).json(
        new ApiResponse(200, adminMessage, 'Admin message found')
    );
});

export {
    getNotificationData,
    sendNotificationCustomerProfile,
    customerMessageForAdmin,
    adminMessageForCustomer
};