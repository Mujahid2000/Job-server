"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import { createIndexes } from './ApplicantModels';
const ResumeModel = new mongoose_1.default.Schema({
    userId: {
        type: String,
        index: true,
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
});
const ResumeSchema = mongoose_1.default.model("ResumeCollection", ResumeModel);
exports.default = ResumeSchema;
