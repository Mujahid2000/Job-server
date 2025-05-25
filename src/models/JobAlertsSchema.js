const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobAlertSchemas = mongoose.model('JobAlert', jobAlertSchema);

module.exports = JobAlertSchemas