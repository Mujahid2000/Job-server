import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
const NotificationSchemas = require('../models/NotificationSchema');
const SaveNotificationSchema = require('../models/SaveNotificationSchema');
const AdminChatMessageSaveForAdmin = require('../models/AdminChatMessageForUser');
const CustomerProfile = require('../models/CustomerProfile');

/**
 * Shared handler to send notification
 */
const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { io }: any = req;
    const { id, companyUser, applicantId, jobId, message, Name, type } = req.body;

    // Validate required fields
    if (!id || !companyUser || !applicantId || !jobId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const notification = {
        id,
        companyUser,
        applicantId,
        jobId,
        message,
        Name,
        time: new Date(),
        type,
    };

    try {
        const userNotificationStatus = await NotificationSchemas.findOne({ userId: applicantId });

        if (!userNotificationStatus) {
            return res.status(404).json({ error: 'No notification record found for this user' });
        }

        // Check eligibility based on notification type
        const isAllowed =
            type === 'shortlist'
                ? userNotificationStatus.shortlist
                : userNotificationStatus.savedProfile;

        if (!isAllowed) {
            return res.status(200).json({ message: `Notification not sent: User is not eligible for ${type}` });
        }

        // Save to appropriate schema
        await SaveNotificationSchema.create(notification);

        // Emit via socket
        io.to(applicantId).emit('receiveNotification', notification);

        return res.status(200).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        console.error(`Error sending ${type} notification:`, error);
        return res.status(500).json({ error: `Failed to send ${type} notification` });
    }
});

const customerMessage = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { io }: any = req;
        const { senderId, role, message, id, email, name, isAdmin, receiverId, isRead } = req.body;

        // Basic validation
        if (!senderId || !message || !id || !role || !receiverId || !email || !name) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const msgData = { senderId, role, message, id, email, name, isAdmin, receiverId, isRead, dateWithTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) };

        let findProfile = await CustomerProfile.findOne({ senderId });

        if (!findProfile) {
            if (!name || !email) {
                return res.status(400).json({ success: false, error: 'Name and email are required for new profile' });
            }

            const saveCustomerProfile = new CustomerProfile({ senderId, name, email });
            findProfile = await saveCustomerProfile.save();
        }

        // ✅ যে-ই হোক, তার receiverId অনুযায়ী মেসেজ পাঠিয়ে দাও
        io.to(receiverId).emit('message', msgData);

        // ✅ ডাটাবেজে সেভ করো
        const saveUserMessage = new AdminChatMessageSaveForAdmin(msgData);
        await saveUserMessage.save();

        return res.status(200).json({ success: true, data: msgData });

    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ success: false, error: 'Failed to save message' });
    }
});

export {
    sendNotification,
    customerMessage
};
