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
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('SaveNotification', saveNotificationSchema);
