"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true }, // userId ফিল্ড স্ট্রিং হিসেবে
    shortlist: { type: Boolean, default: false },
    jobsExpire: { type: Boolean, default: false },
    jobAlerts: { type: Boolean, default: false },
    savedProfile: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
});
const NotificationSchemas = mongoose_1.default.model('Notification', notificationSchema);
exports.default = NotificationSchemas;
