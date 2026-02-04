"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const notificationdata_controller_1 = require("../controller/notificationdata.controller");
router.route('/notificationData/:userId').get(notificationdata_controller_1.getNotificationData);
router.route('/customerProfile/:senderId').get(notificationdata_controller_1.sendNotificationCustomerProfile);
router.route('/customerMessageForAdmin/:customerId').get(notificationdata_controller_1.customerMessageForAdmin);
router.route('/adminMessageForCustomer').get(notificationdata_controller_1.adminMessageForCustomer);
exports.default = router;
