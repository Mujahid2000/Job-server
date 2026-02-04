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
exports.adminMessageForCustomer = exports.customerMessageForAdmin = exports.sendNotificationCustomerProfile = exports.getNotificationData = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const SaveNotificationSchema_1 = __importDefault(require("../models/SaveNotificationSchema"));
const CustomerProfile_1 = __importDefault(require("../models/CustomerProfile"));
const UserChatMessageSaveForAdmin_1 = __importDefault(require("../models/UserChatMessageSaveForAdmin"));
const AdminChatMessageForUser_1 = __importDefault(require("../models/AdminChatMessageForUser"));
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const getNotificationData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const notifications = yield SaveNotificationSchema_1.default.aggregate([
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
        if (!notifications || notifications.length === 0) {
            throw new ApiError_1.ApiError(404, 'No notifications found');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, notifications, 'Notification data retrieved'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Server error', [error.message]);
    }
}));
exports.getNotificationData = getNotificationData;
const sendNotificationCustomerProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId } = req.params;
        const HARD_CODED_ID = '6825e7123d8cff36ca7afe9b'; // হার্ডকোডেড আইডি
        // ইনপুট ভ্যালিডেশন
        if (!senderId) {
            throw new ApiError_1.ApiError(400, 'Sender ID is required');
        }
        // senderId এবং হার্ডকোডেড আইডি ম্যাচ চেক
        if (senderId === HARD_CODED_ID) {
            const profiles = yield CustomerProfile_1.default.aggregate([
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
            ]); // সব প্রোফাইল ফেচ করা
            if (!profiles || profiles.length === 0) {
                throw new ApiError_1.ApiError(404, 'No profiles found');
            }
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, profiles, 'Profiles fetched successfully'));
        }
        else {
            throw new ApiError_1.ApiError(403, 'Unauthorized: Sender ID does not match');
        }
    }
    catch (error) {
        console.error('Error fetching profiles:', error);
        throw new ApiError_1.ApiError(500, 'Failed to fetch profiles', [error.message]);
    }
}));
exports.sendNotificationCustomerProfile = sendNotificationCustomerProfile;
const customerMessageForAdmin = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    if (!customerId) {
        throw new ApiError_1.ApiError(404, 'customer id is required');
    }
    try {
        const customerMessage = yield UserChatMessageSaveForAdmin_1.default.find({ senderId: customerId });
        if (!customerMessage) {
            throw new ApiError_1.ApiError(404, 'No message found');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, customerMessage, 'Found messages'));
    }
    catch (error) {
        console.error('Error fetching profiles:', error);
        throw new ApiError_1.ApiError(500, 'Failed to fetch profiles', [error.message]);
    }
}));
exports.customerMessageForAdmin = customerMessageForAdmin;
const adminMessageForCustomer = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, userid } = req.query;
    console.log(adminId, userid);
    if (!userid || !adminId) {
        throw new ApiError_1.ApiError(404, 'user id is required');
    }
    try {
        const adminMessage = yield AdminChatMessageForUser_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: adminId },
                        { senderId: userid },
                        { receiverId: adminId },
                        { receiverId: userid }
                    ]
                }
            },
            {
                $sort: { createdAt: 1 } // 1 = Ascending (Old → New), use -1 for descending
            }
        ]);
        if (!adminMessage || adminMessage.length === 0) {
            throw new ApiError_1.ApiError(404, 'Messages Data not found');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, adminMessage, 'admin message found'));
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        throw new ApiError_1.ApiError(500, 'Failed to fetch messages', [error.message]);
    }
}));
exports.adminMessageForCustomer = adminMessageForCustomer;
