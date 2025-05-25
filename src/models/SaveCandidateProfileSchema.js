const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    applicantId: {
        type: String,
        required: true
    }
})


const saveCandidateProfileModel = mongoose.model('candidateProfile', candidateProfileSchema);


module.exports = saveCandidateProfileModel;