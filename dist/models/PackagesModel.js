"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PackagesSchema = new mongoose_1.default.Schema({
    companyId: { type: String, required: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, required: true },
    features: { type: [String], required: true }, // Updated to an array of strings
    description: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Packages', PackagesSchema);
