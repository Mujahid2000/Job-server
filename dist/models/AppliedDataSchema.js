"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Helper to format date as "24th April, 2025"
function formatDate(date) {
    const day = date.getDate();
    const suffix = (d) => {
        if (d > 3 && d < 21)
            return 'th';
        switch (d % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${day}${suffix(day)} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
const jobApplySchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    resume_Id: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: () => formatDate(new Date())
    }
}, {
    timestamps: true
});
const JobAppliedSchema = mongoose_1.default.model('jobApplyData', jobApplySchema);
exports.default = JobAppliedSchema;
