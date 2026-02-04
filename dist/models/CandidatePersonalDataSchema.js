"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PersonalData = new mongoose_1.default.Schema({
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
const CandidatePersonalDataSchema = mongoose_1.default.model('PersonalData', PersonalData);
exports.default = CandidatePersonalDataSchema;
