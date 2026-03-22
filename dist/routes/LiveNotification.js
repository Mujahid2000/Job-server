"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const livenotification_controller_1 = require("../controller/livenotification.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const notification_validation_1 = require("../validations/notification.validation");
/**
 * @swagger
 * tags:
 *   name: Live Notifications
 *   description: Real-time notification services
 */
/**
 * @swagger
 * /liveNotification/send:
 *   post:
 *     summary: Send a shortlist notification
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post('/send', (0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.postNotification), (req, res, next) => {
    req.body.type = 'shortlist';
    (0, livenotification_controller_1.sendNotification)(req, res, next);
});
/**
 * @swagger
 * /liveNotification/sendSavedProfile:
 *   post:
 *     summary: Send a saved profile notification
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post('/sendSavedProfile', (0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.postNotification), (req, res, next) => {
    req.body.type = 'savedProfile';
    (0, livenotification_controller_1.sendNotification)(req, res, next);
});
/**
 * @swagger
 * /liveNotification/customerMessage:
 *   post:
 *     summary: Send a customer message
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/customerMessage', (0, validateMiddleware_1.default)(notification_validation_1.notificationValidation.postCustomerMessage), livenotification_controller_1.customerMessage);
exports.default = router;
