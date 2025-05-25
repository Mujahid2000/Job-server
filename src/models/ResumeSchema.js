const mongoose = require('mongoose');
const { createIndexes } = require('./ApplicantModels');

const ResumeModel = new mongoose.Schema({
    userId:{
        type: String,
        createIndexes,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    resumeName: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        require: true
    }
})


const ResumeSchema = mongoose.model("ResumeCollection", ResumeModel);

module.exports = ResumeSchema;