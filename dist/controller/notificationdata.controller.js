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
exports.adminMessageForCustomer = exports.customerMessageForAdmin = exports.sendNotificationCustomerProfile = exports.getNotificationData = void 0;
const notification_service_1 = require("../services/notification.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = require("../utils/ApiError");
const getNotificationData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const notifications = yield notification_service_1.notificationService.getNotificationData(userId);
    if (!notifications || notifications.length === 0) {
        throw new ApiError_1.ApiError(404, 'No notifications found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notifications, 'Notification data retrieved'));
}));
exports.getNotificationData = getNotificationData;
const sendNotificationCustomerProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId } = req.params;
    const profiles = yield notification_service_1.notificationService.getCustomerProfilesForAdmin(senderId);
    if (!profiles || profiles.length === 0) {
        throw new ApiError_1.ApiError(404, 'No profiles found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, profiles, 'Profiles fetched successfully'));
}));
exports.sendNotificationCustomerProfile = sendNotificationCustomerProfile;
const customerMessageForAdmin = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const customerMessage = yield notification_service_1.notificationService.getCustomerMessagesForAdmin(customerId);
    if (!customerMessage || customerMessage.length === 0) {
        throw new ApiError_1.ApiError(404, 'No message found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, customerMessage, 'Found messages'));
}));
exports.customerMessageForAdmin = customerMessageForAdmin;
const adminMessageForCustomer = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, userid } = req.query;
    const adminMessage = yield notification_service_1.notificationService.getAdminMessagesForCustomer(adminId, userid);
    if (!adminMessage || adminMessage.length === 0) {
        throw new ApiError_1.ApiError(404, 'Messages Data not found');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, adminMessage, 'Admin message found'));
}));
exports.adminMessageForCustomer = adminMessageForCustomer;
