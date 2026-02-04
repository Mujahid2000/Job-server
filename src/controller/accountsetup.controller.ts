import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import mongoose from "mongoose";
import CompanyModel from "../models/CompanyModel";
import FounderInfo from "../models/FounderInfoModel";
import SocialMedia from "../models/SocialMediaModel";
import LastContact from "../models/ContactSchema";
import { cloudinaryUploadBuffer } from "../utils/FileUploader";

const postCompanyInfo = asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, companyName, biography } = req.body;
        const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

        if (!userId || !companyName) {
            await session.abortTransaction();
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
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: 'Logo must be a JPEG or PNG image' });
            }

            const result: any = await cloudinaryUploadBuffer(file.buffer, file.mimetype, 'image');
            logoUrl = result.secure_url;
        }

        let bannerUrl = '';
        if (files.banner) {
            const file = files.banner[0];
            if (!allowedImageTypes.includes(file.mimetype)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ error: 'Banner must be a JPEG or PNG image' });
            }

            const result: any = await cloudinaryUploadBuffer(file.buffer, file.mimetype, 'image');
            bannerUrl = result.secure_url;
        }

        const companyData = new CompanyModel({
            userId,
            companyName,
            logo: logoUrl,
            banner: bannerUrl,
            biography
        });

        const companyDataSave = await companyData.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Data sent to database successfully',
            data: companyDataSave
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error in /companyInfo:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors as any).map((err: any) => err.message);
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
});

const postFounderInfo = asyncHandler(async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            userId,
            organizationType,
            industryTypes,
            teamSize,
            yearOfEstablishment,
            companyWebsite,
            companyVision
        } = req.body;

        if (!userId || !organizationType || !industryTypes || !teamSize || !yearOfEstablishment || !companyWebsite || !companyVision) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, organizationType, industryTypes, teamSize, yearEstablished, companyWebsite, and companyVision are required'
            });
        }

        const founderData = new FounderInfo({
            userId,
            organizationType,
            industryTypes,
            teamSize,
            yearEstablished: yearOfEstablishment,
            companyWebsite,
            companyVision
        });

        const founderDataSave = await founderData.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Founder information saved successfully',
            data: founderDataSave
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error in /founderInfo:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors as any).map((err: any) => err.message);
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
});

const postSocialMediaInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId, socialLinks } = req.body;
    const links = socialLinks || [];

    try {
        if (!userId || !Array.isArray(links) || links.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId and socialLinks are required',
            });
        }

        const saveSocialMediaData = new SocialMedia({
            userId,
            socialLinks: links,
        })

        const saveSocialMediaDataSave = await saveSocialMediaData.save();

        res.status(200).json({
            success: true,
            message: 'Social media links updated successfully',
            data: saveSocialMediaDataSave,
        });
    } catch (error: any) {
        console.error('Error in /socialMediaInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating social media links',
            error: error.message,
        });
    }
});

const postContactInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId, mapLocation, phoneNumber, email } = req.body;
    try {
        if (!userId || !mapLocation || !phoneNumber || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, mapLocation, phoneNumber, and email are required',
            });
        }

        const contactData = new LastContact({
            userId,
            mapLocation,
            phoneNumber,
            email,
        });

        const contactDataSave = await contactData.save();

        res.status(200).json({
            success: true,
            message: 'Contact information saved successfully',
            data: contactDataSave,
        });
    } catch (error: any) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        });
    }
});

const getContactData = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const userContactDataFind = await LastContact.findOne({ email: email });
        res.status(200).json({ message: 'contact data found', data: userContactDataFind })
    } catch (error: any) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        });
    }
});

export {
    postCompanyInfo,
    postFounderInfo,
    postSocialMediaInfo,
    postContactInfo,
    getContactData
}
