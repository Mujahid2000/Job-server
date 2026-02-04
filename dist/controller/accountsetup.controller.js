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
exports.getContactData = exports.postContactInfo = exports.postSocialMediaInfo = exports.postFounderInfo = exports.postCompanyInfo = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const FounderInfoModel_1 = __importDefault(require("../models/FounderInfoModel"));
const SocialMediaModel_1 = __importDefault(require("../models/SocialMediaModel"));
const ContactSchema_1 = __importDefault(require("../models/ContactSchema"));
const FileUploader_1 = require("../utils/FileUploader");
const postCompanyInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, companyName, biography } = req.body;
        const files = req.files || {};
        if (!userId || !companyName) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId and companyName are required'
            });
        }
        const allowedImageTypes = ['image/jpeg', 'image/png'];
        let logoUrl = '';
        if (files.logo) {
            const file = files.logo[0];
            if (!allowedImageTypes.includes(file.mimetype)) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: 'Logo must be a JPEG or PNG image' });
            }
            const result = yield (0, FileUploader_1.cloudinaryUploadBuffer)(file.buffer, file.mimetype, 'image');
            logoUrl = result.secure_url;
        }
        let bannerUrl = '';
        if (files.banner) {
            const file = files.banner[0];
            if (!allowedImageTypes.includes(file.mimetype)) {
                yield session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: 'Banner must be a JPEG or PNG image' });
            }
            const result = yield (0, FileUploader_1.cloudinaryUploadBuffer)(file.buffer, file.mimetype, 'image');
            bannerUrl = result.secure_url;
        }
        const companyData = new CompanyModel_1.default({
            userId,
            companyName,
            logo: logoUrl,
            banner: bannerUrl,
            biography
        });
        const companyDataSave = yield companyData.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'Data sent to database successfully',
            data: companyDataSave
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error('Error in /companyInfo:', error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry: userId already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating company',
            error: error.message
        });
    }
}));
exports.postCompanyInfo = postCompanyInfo;
const postFounderInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, organizationType, industryTypes, teamSize, yearOfEstablishment, companyWebsite, companyVision } = req.body;
        if (!userId || !organizationType || !industryTypes || !teamSize || !yearOfEstablishment || !companyWebsite || !companyVision) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, organizationType, industryTypes, teamSize, yearEstablished, companyWebsite, and companyVision are required'
            });
        }
        const founderData = new FounderInfoModel_1.default({
            userId,
            organizationType,
            industryTypes,
            teamSize,
            yearEstablished: yearOfEstablishment,
            companyWebsite,
            companyVision
        });
        const founderDataSave = yield founderData.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'Founder information saved successfully',
            data: founderDataSave
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error('Error in /founderInfo:', error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry detected'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error saving founder information',
            error: error.message
        });
    }
}));
exports.postFounderInfo = postFounderInfo;
const postSocialMediaInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, socialLinks } = req.body;
    const links = socialLinks || [];
    try {
        if (!userId || !Array.isArray(links) || links.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId and socialLinks are required',
            });
        }
        const saveSocialMediaData = new SocialMediaModel_1.default({
            userId,
            socialLinks: links,
        });
        const saveSocialMediaDataSave = yield saveSocialMediaData.save();
        res.status(200).json({
            success: true,
            message: 'Social media links updated successfully',
            data: saveSocialMediaDataSave,
        });
    }
    catch (error) {
        console.error('Error in /socialMediaInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating social media links',
            error: error.message,
        });
    }
}));
exports.postSocialMediaInfo = postSocialMediaInfo;
const postContactInfo = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, mapLocation, phoneNumber, email } = req.body;
    try {
        if (!userId || !mapLocation || !phoneNumber || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, mapLocation, phoneNumber, and email are required',
            });
        }
        const contactData = new ContactSchema_1.default({
            userId,
            mapLocation,
            phoneNumber,
            email,
        });
        const contactDataSave = yield contactData.save();
        res.status(200).json({
            success: true,
            message: 'Contact information saved successfully',
            data: contactDataSave,
        });
    }
    catch (error) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        });
    }
}));
exports.postContactInfo = postContactInfo;
const getContactData = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const userContactDataFind = yield ContactSchema_1.default.findOne({ email: email });
        res.status(200).json({ message: 'contact data found', data: userContactDataFind });
    }
    catch (error) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        });
    }
}));
exports.getContactData = getContactData;
