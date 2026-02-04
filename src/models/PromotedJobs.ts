import mongoose from "mongoose";

const promotedSchema = new mongoose.Schema({
    userId: String,
    jobId: String,
    companyId: String,
    promotedSystem: String
})


const promotedJobs = mongoose.model('promotedList', promotedSchema);

export default promotedJobs;