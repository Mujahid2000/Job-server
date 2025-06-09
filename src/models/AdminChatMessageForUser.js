// models/ChatMessage.js

const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
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

const AdminChatMessageSaveForAdmin = mongoose.model('AdminChatMessageSaveForAdmin', ChatMessageSchema);
module.exports = AdminChatMessageSaveForAdmin
