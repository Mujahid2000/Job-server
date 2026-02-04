"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContactSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    mapLocation: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}, {
    timestamps: true,
});
const LastContact = mongoose_1.default.model('Contact', ContactSchema);
exports.default = LastContact;
