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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const SaveNotificationSchema_1 = __importDefault(require("../models/SaveNotificationSchema"));
const CustomerProfile_1 = __importDefault(require("../models/CustomerProfile"));
const UserChatMessageSaveForAdmin_1 = __importDefault(require("../models/UserChatMessageSaveForAdmin"));
const AdminChatMessageForUser_1 = __importDefault(require("../models/AdminChatMessageForUser"));
const NotificationSchema_1 = __importDefault(require("../models/NotificationSchema")); // Correctly import the schema
const ApiError_1 = require("../utils/ApiError");
const getNotificationData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield SaveNotificationSchema_1.default.aggregate([
        {
            $match: {
                applicantId: `${userId}`,
            },
        },
        {
            $lookup: {
                from: "companydatas",
                localField: "companyUser",
                foreignField: "userId",
                as: "result",
            },
        },
        {
            $unwind: {
                path: "$result",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                companyName: "$result.companyName",
            },
        },
        {
            $project: {
                id: 1,
                applicantId: 1,
                jobId: 1,
                message: 1,
                Name: 1,
                companyUser: 1,
                companyName: 1,
                time: 1
            },
        },
    ]);
});
const getCustomerProfilesForAdmin = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const HARD_CODED_ID = '6825e7123d8cff36ca7afe9b';
    if (senderId !== HARD_CODED_ID) {
        throw new ApiError_1.ApiError(403, 'Unauthorized: Sender ID does not match');
    }
    return yield CustomerProfile_1.default.aggregate([
        {
            $lookup: {
                from: "applicants",
                localField: "senderId",
                foreignField: "userId",
                as: "customer",
            },
        },
        {
            $unwind: {
                path: "$customer",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                name: "$customer.fullName",
                picture: "$customer.profilePicture",
            },
        },
        {
            $project: {
                name: 1,
                picture: 1,
                email: 1,
                senderId: 1,
            },
        },
    ]);
});
const getCustomerMessagesForAdmin = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserChatMessageSaveForAdmin_1.default.find({ senderId: customerId });
});
const getAdminMessagesForCustomer = (adminId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield AdminChatMessageForUser_1.default.aggregate([
        {
            $match: {
                $or: [
                    { senderId: adminId },
                    { senderId: userId },
                    { receiverId: adminId },
                    { receiverId: userId }
                ]
            }
        },
        {
            $sort: { createdAt: 1 }
        }
    ]);
});
const sendNotification = (notificationData, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicantId, type } = notificationData;
    const userNotificationStatus = yield NotificationSchema_1.default.findOne({ userId: applicantId });
    if (!userNotificationStatus) {
        throw new ApiError_1.ApiError(404, 'No notification record found for this user');
    }
    const isAllowed = type === 'shortlist'
        ? userNotificationStatus.shortlist
        : userNotificationStatus.savedProfile;
    if (!isAllowed) {
        return null; // or throw a custom error if you want to differentiate
    }
    const notification = Object.assign(Object.assign({}, notificationData), { time: new Date() });
    yield SaveNotificationSchema_1.default.create(notification);
    io.to(applicantId).emit('receiveNotification', notification);
    return notification;
});
const customerMessage = (msgDataBody, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, name, email, receiverId } = msgDataBody;
    const msgData = Object.assign(Object.assign({}, msgDataBody), { dateWithTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) });
    let findProfile = yield CustomerProfile_1.default.findOne({ senderId });
    if (!findProfile) {
        const saveCustomerProfile = new CustomerProfile_1.default({ senderId, name, email });
        yield saveCustomerProfile.save();
    }
    io.to(receiverId).emit('message', msgData);
    const saveUserMessage = new AdminChatMessageForUser_1.default(msgData);
    yield saveUserMessage.save();
    return msgData;
});
exports.notificationService = {
    getNotificationData,
    getCustomerProfilesForAdmin,
    getCustomerMessagesForAdmin,
    getAdminMessagesForCustomer,
    sendNotification,
    customerMessage,
};
