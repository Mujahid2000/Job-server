const express = require('express');
const router = express.Router();
const CompanyModel = require('../models/CompanyModel');
const FounderInfo = require('../models/FounderInfoModel');
const SocialMedia = require('../models/SocialMediaModel');
const LastContact = require('../models/ContactSchema');

router.get('/companyDataById/:id', async (req, res) => {
    const id = req.params.id; // Extract id as a string
    try {
        // Use aggregation to fetch data from both collections
        const result = await CompanyModel.aggregate([
            {
                $match: { userId: id } // Match the userId in CompanyModel
            },
            {
                $lookup: {
                    from: 'contacts', 
                    localField: 'userId', 
                    foreignField: 'userId', 
                    as: 'contactData' 
                }
            },
            {
                $project: {
                    userId: 1,
                    companyName: 1,
                    mapLocation: {
                        $ifNull: [
                            { $arrayElemAt: ['$contactData.mapLocation', 0] }, // Get mapLocation from first contact
                            null // Default to null if no contact data
                        ]
                    }
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json(result[0]); // Return the first (and only) result
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/companyPersonal/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Use lean() for better performance if you don't need mongoose document methods
        const companyPersonal = await CompanyModel.findOne({ userId }).lean();
        if (!companyPersonal) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        // Optionally, remove sensitive fields before sending response
        // delete companyProfile.sensitiveField;

        return res.status(200).json(companyPersonal);
    } catch (error) {
        console.error('Error fetching company profile:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/companyProfile/:userId', async (req, res) => {
    const { userId } = req.params;

    // Basic validation: check if userId is provided and is a non-empty string
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return res.status(400).json({ message: 'Invalid or missing userId parameter' });
    }

    try {
        const companyProfile = await FounderInfo.findOne({ userId }).lean();
        if (!companyProfile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }
        return res.status(200).json(companyProfile);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/companySocialLink/:userId', async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return res.status(400).json({ message: 'Invalid or missing userId parameter' });
    }

    try {
        const companySocialLink = await SocialMedia.findOne({ userId }).lean();
        if (!companySocialLink) {
            return res.status(404).json({ message: 'Social media links not found' });
        }
        return res.status(200).json(companySocialLink);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/companyContacts/:userId', async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return res.status(400).json({ message: 'Invalid or missing userId parameter' });
    }

    try {
        const companyContact = await LastContact.findOne({ userId }).lean();
        if (!companyContact) {
            return res.status(404).json({ message: 'Company contact not found' });
        }
        return res.status(200).json(companyContact);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;