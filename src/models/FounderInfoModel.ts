import mongoose from "mongoose";

const FounderInfoSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    organizationType: {
        type: String,
        required: true
    },
    industryTypes: {
        type: String,
        required: true
    },
    teamSize: {
        type: String,
        required: true
    },
    yearEstablished: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: false
    },
    companyVision: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const FounderInfo = mongoose.model('FounderInfo', FounderInfoSchema);

export default FounderInfo;