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
const notification_service_1 = require("../services/notification.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const sendNotification = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { io } = req;
    const { type } = req.body;
    const notification = yield notification_service_1.notificationService.sendNotification(req.body, io);
    if (!notification) {
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, `Notification not sent: User is not eligible for ${type}`));
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, notification, 'Notification sent successfully'));
}));
exports.sendNotification = sendNotification;
const customerMessage = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { io } = req;
    const msgData = yield notification_service_1.notificationService.customerMessage(req.body, io);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, msgData, 'Message sent successfully'));
}));
exports.customerMessage = customerMessage;
