"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerMessage = exports.sendNotification = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const NotificationSchemas = require('../models/NotificationSchema');
const SaveNotificationSchema = require('../models/SaveNotificationSchema');
const AdminChatMessageSaveForAdmin = require('../models/AdminChatMessageForUser');
const CustomerProfile = require('../models/CustomerProfile');
/**
 * Shared handler to send notification
 */
const sendNotification = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { io } = req;
    const { id, companyUser, applicantId, jobId, message, Name, type } = req.body;
    // Validate required fields
    if (!id || !companyUser || !applicantId || !jobId || !message) {
        throw new ApiError_1.ApiError(400, 'Missing required fields');
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
        const userNotificationStatus = yield NotificationSchemas.findOne({ userId: applicantId });
        if (!userNotificationStatus) {
            throw new ApiError_1.ApiError(404, 'No notification record found for this user');
        }
        // Check eligibility based on notification type
        const isAllowed = type === 'shortlist'
            ? userNotificationStatus.shortlist
            : userNotificationStatus.savedProfile;
        if (!isAllowed) {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, `Notification not sent: User is not eligible for ${type}`));
        }
        // Save to appropriate schema
        yield SaveNotificationSchema.create(notification);
        // Emit via socket
        io.to(applicantId).emit('receiveNotification', notification);
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification sent successfully'));
    }
    catch (error) {
        console.error(`Error sending ${type} notification:`, error);
        throw new ApiError_1.ApiError(500, `Failed to send ${type} notification`, [error.message]);
    }
}));
exports.sendNotification = sendNotification;
const customerMessage = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { io } = req;
        const { senderId, role, message, id, email, name, isAdmin, receiverId, isRead } = req.body;
        // Basic validation
        if (!senderId || !message || !id || !role || !receiverId || !email || !name) {
            throw new ApiError_1.ApiError(400, 'Missing required fields');
        }
        const msgData = { senderId, role, message, id, email, name, isAdmin, receiverId, isRead, dateWithTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) };
        let findProfile = yield CustomerProfile.findOne({ senderId });
        if (!findProfile) {
            if (!name || !email) {
                throw new ApiError_1.ApiError(400, 'Name and email are required for new profile');
            }
            const saveCustomerProfile = new CustomerProfile({ senderId, name, email });
            findProfile = yield saveCustomerProfile.save();
        }
        // ✅ যে-ই হোক, তার receiverId অনুযায়ী মেসেজ পাঠিয়ে দাও
        io.to(receiverId).emit('message', msgData);
        // ✅ ডাটাবেজে সেভ করো
        const saveUserMessage = new AdminChatMessageSaveForAdmin(msgData);
        yield saveUserMessage.save();
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, msgData, 'Message sent successfully'));
    }
    catch (error) {
        console.error('Error saving message:', error);
        throw new ApiError_1.ApiError(500, 'Failed to save message', [error.message]);
    }
}));
exports.customerMessage = customerMessage;
