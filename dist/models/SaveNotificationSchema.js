"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function getFormattedDate() {
    const date = new Date(); // Get the current date and time
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${formattedTime}, ${day}${suffix} ${month} ${year}`;
}
// Function to determine the correct suffix for the day
function getDaySuffix(day) {
    if (day >= 11 && day <= 13)
        return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}
const saveNotificationSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    companyUser: {
        type: String,
        required: true,
    },
    applicantId: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    time: {
        type: String,
        default: getFormattedDate,
    },
});
exports.default = mongoose_1.default.model('SaveNotification', saveNotificationSchema);
