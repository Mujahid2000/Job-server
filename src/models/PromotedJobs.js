const mongoose = require('mongoose');

const promotedSchema = new mongoose.Schema({
    userId: String,
    jobId: String,
    companyId: String,
    promotedSystem: String
})


const promotedJobs = mongoose.model('promotedList', promotedSchema);

module.exports = promotedJobs