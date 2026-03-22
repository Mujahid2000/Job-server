"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ContactSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    primaryEmail: {
        type: String,
        required: true
    },
    secondaryEmail: {
        type: String
    },
    primaryPhone: {
        type: String,
        required: true
    },
    secondaryPhone: {
        type: String
    },
    socialLinks: {
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
    },
});
const ContactData = mongoose_1.default.model("Contact", ContactSchema);
exports.default = ContactData;
