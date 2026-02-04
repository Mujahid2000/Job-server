"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const promotedSchema = new mongoose_1.default.Schema({
    userId: String,
    jobId: String,
    companyId: String,
    promotedSystem: String
});
const promotedJobs = mongoose_1.default.model('promotedList', promotedSchema);
exports.default = promotedJobs;
