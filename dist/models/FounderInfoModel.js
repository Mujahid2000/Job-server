"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FounderInfoSchema = new mongoose_1.default.Schema({
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
const FounderInfo = mongoose_1.default.model('FounderInfo', FounderInfoSchema);
exports.default = FounderInfo;
