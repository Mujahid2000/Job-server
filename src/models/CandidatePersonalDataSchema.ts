import mongoose from "mongoose";

const PersonalData = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: false,
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
        required: false,
    },
    education: {
        type: String,
        required: false,
    },
    experience: {
        type: String,
        required: false,
    },
    biography: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        index: true,
        required: true
    }
});

// Create an index on userId
PersonalData.index({ userId: 1 });

const CandidatePersonalDataSchema = mongoose.model('PersonalData', PersonalData);

export default CandidatePersonalDataSchema;