"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatMessageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    id: {
        type: String, // Socket Room ID বা Conversation ID
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    dateWithTime: {
        type: String, // e.g., "2025-06-08 2:34 PM"
        required: true,
    },
}, {
    timestamps: true, // createdAt, updatedAt
});
const AdminChatMessageSaveForAdmin = mongoose_1.default.model('AdminChatMessageSaveForAdmin', ChatMessageSchema);
exports.default = AdminChatMessageSaveForAdmin;
