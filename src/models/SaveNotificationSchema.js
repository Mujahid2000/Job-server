const mongoose = require('mongoose');

function formatDate(date) {
    const day = date.getDate();
    const suffix = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return 'st';
            case 2:  return 'nd';
            case 3:  return 'rd';
            default: return 'th';
        }
    };
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${day}${suffix(day)} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}


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
  timestamp: {
    type: Date,
    default: () => formatDate(new Date()),
  },
}, { timestamps: true });

module.exports = mongoose.model('SaveNotification', saveNotificationSchema);
