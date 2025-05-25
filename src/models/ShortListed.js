const mongoose = require('mongoose');
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