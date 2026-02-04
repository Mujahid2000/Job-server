"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const companyModel = new mongoose_1.default.Schema({
    userId: { type: String, require: true },
    companyName: { type: String, require: true },
    logo: { type: String, require: true },
    banner: { type: String, require: true },
    biography: { type: String, require: true },
});
exports.default = mongoose_1.default.model("CompanyData", companyModel);
