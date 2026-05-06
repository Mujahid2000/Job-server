"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUploadBuffer = exports.cloudinaryFileDelete = exports.cloudinaryFileUpload = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryFileUpload = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePath)
            return null;
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        fs_1.default.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        fs_1.default.unlinkSync(localFilePath);
        return null;
    }
});
exports.cloudinaryFileUpload = cloudinaryFileUpload;
const cloudinaryFileDelete = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!public_id)
            return null;
        const response = yield cloudinary_1.v2.uploader.destroy(public_id);
        return response;
    }
    catch (error) {
        return null;
    }
});
exports.cloudinaryFileDelete = cloudinaryFileDelete;
const cloudinaryUploadBuffer = (fileBuffer_1, mimetype_1, ...args_1) => __awaiter(void 0, [fileBuffer_1, mimetype_1, ...args_1], void 0, function* (fileBuffer, mimetype, resourceType = "auto") {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            uploadStream.end(fileBuffer);
        });
    }
    catch (error) {
        console.error("Error in cloudinaryUploadBuffer:", error);
        return null;
    }
});
exports.cloudinaryUploadBuffer = cloudinaryUploadBuffer;
