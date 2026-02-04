"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profilePrivacySchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    profilePublic: {
        type: Boolean,
        default: false,
    },
    resumePublic: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const ProfilePrivacySchemas = mongoose_1.default.model('ProfilePrivacy', profilePrivacySchema);
exports.default = ProfilePrivacySchemas;
