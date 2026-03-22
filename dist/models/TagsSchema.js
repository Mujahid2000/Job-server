"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TagsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // optional: removes extra spaces
        unique: true // optional: prevent duplicates
    }
}, { timestamps: true });
const Tag = mongoose_1.default.model('Tag', TagsSchema);
exports.default = Tag;
