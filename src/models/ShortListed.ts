import mongoose from "mongoose";
const ShortListed = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    resumeId: {
        type: String,
        required: true
    }
})

export default mongoose.model('ShortListed', ShortListed);