"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SocialMediaSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, unique: true },
    socialLinks: [
        {
            platform: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
});
const SocialMedia = mongoose_1.default.model("SocialMediaInfo", SocialMediaSchema);
exports.default = SocialMedia;
