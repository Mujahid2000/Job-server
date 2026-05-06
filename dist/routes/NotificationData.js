"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const notificationdata_controller_1 = require("../controller/notificationdata.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const notification_validation_1 = require("../validations/notification.validation");
/**
 * @swagger
 * tags:
 *   name: Notification Data
 *   description: Management of notification data and messages
 */
/**
 * @swagger
 * /notification/notificationData/{userId}:
 *   get:
 *     summary: Get notification data for a user
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification data fetched
 */
router.route('/notificationData/:userId').get((0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.getParamsUserId), notificationdata_controller_1.getNotificationData);
/**
 * @swagger
 * /notification/customerProfile/{senderId}:
 *   get:
 *     summary: Get notification for a customer profile sender
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification data fetched
 */
router.route('/customerProfile/:senderId').get((0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.getParamsSenderId), notificationdata_controller_1.sendNotificationCustomerProfile);
/**
 * @swagger
 * /notification/customerMessageForAdmin/{customerId}:
 *   get:
 *     summary: Get customer messages for admin
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer messages fetched
 */
router.route('/customerMessageForAdmin/:customerId').get((0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.getParamsCustomerId), notificationdata_controller_1.customerMessageForAdmin);
/**
 * @swagger
 * /notification/adminMessageForCustomer:
 *   get:
 *     summary: Get admin messages for customers
 *     tags: [Notification Data]
 *     responses:
 *       200:
 *         description: Admin messages fetched
 */
router.route('/adminMessageForCustomer').get((0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.getQueryAdminUserId), notificationdata_controller_1.adminMessageForCustomer);
exports.default = router;
