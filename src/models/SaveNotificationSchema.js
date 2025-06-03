const mongoose = require('mongoose');

const saveNotificationSchema = new mongoose.Schema({
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
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('SaveNotification', saveNotificationSchema);
