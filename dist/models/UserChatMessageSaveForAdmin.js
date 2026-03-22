"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserChatMessageSchema = new mongoose_1.default.Schema({
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }, // User's unique id
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    dateWithTime: {
        type: String,
        default: function () {
            const date = new Date();
            const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            let day = date.getDate();
            let month = months[date.getMonth()];
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            // Add suffix to day
            let daySuffix = "th";
            if (day % 10 === 1 && day !== 11)
                daySuffix = "st";
            else if (day % 10 === 2 && day !== 12)
                daySuffix = "nd";
            else if (day % 10 === 3 && day !== 13)
                daySuffix = "rd";
            return `${day}${daySuffix} ${month} ${year} , ${hours}:${minutes} ${ampm}`;
        },
    },
});
const UserChatMessageSaveForAdmin = mongoose_1.default.model("UserChatMessageSaveForAdmin", UserChatMessageSchema);
exports.default = UserChatMessageSaveForAdmin;
