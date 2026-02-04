import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // userId ফিল্ড স্ট্রিং হিসেবে
  shortlist: { type: Boolean, default: false },
  jobsExpire: { type: Boolean, default: false },
  jobAlerts: { type: Boolean, default: false },
  savedProfile: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
});

const NotificationSchemas = mongoose.model('Notification', notificationSchema);

export default NotificationSchemas;