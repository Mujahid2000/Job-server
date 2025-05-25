const express = require('express');
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const multer  = require('multer');
const CompanyModel = require('../models/CompanyModel');
const FounderInfo = require('../models/FounderInfoModel');
const SocialMedia = require('../models/SocialMediaModel');
const LastContact = require('../models/ContactSchema');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });    
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });




// Route to upload an image to Cloudinary and save the URL in MongoDB
router.post('/companyInfo',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // transaction start
    try {
        const {
            userId,
            companyName,
            biography
        } = req.body;

        const files = req.files || {};
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
        return res.status(400).json({ error: 'Logo must be a JPEG or PNG image' });
      }


      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', quality: 'auto' }, // format: 'auto' was removed
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      });
      logoUrl = result.secure_url;
    }

    // upload banner
    let bannerUrl = '';
    if (files.banner) {
      const file = files.banner[0];
      // MIME টাইপ চেক
      if (!allowedImageTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Banner must be a JPEG or PNG image' });
      }
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', quality: 'auto' }, // format: 'auto' was removed
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      });
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
            console.log(companyDataSave)
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Data sent to database successfully',
            data: companyDataSave
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error in /companyInfo:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
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

router.post('/founderInfo', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // transaction start
    try {
        // Step 1: input data destructure
        const {
            userId,
            organizationType,
            industryTypes,
            teamSize,
            yearOfEstablishment,
            companyWebsite,
            companyVision
        } = req.body;

        // Step 2: input validation
        if (!userId || !organizationType || !industryTypes || !teamSize || !yearOfEstablishment || !companyWebsite || !companyVision) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, organizationType, industryTypes, teamSize, yearEstablished, companyWebsite, and companyVision are required'
            });
        }

        const newDate =  Date.parse(yearOfEstablishment);
        const date = new Date(newDate)

        // Step 3: founder data create and save
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

        // Step 4: success response send
        res.status(201).json({
            success: true,
            message: 'Founder information saved successfully',
            data: founderDataSave
        });
    } catch (error) {
        // Step 5: handle error
        await session.abortTransaction();
        session.endSession();
        console.error('Error in /founderInfo:', error.message);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }
        // duplicate key error handling
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Duplicate entry detected'
            });
        }
        // server error
        res.status(500).json({
            success: false,
            message: 'Error saving founder information',
            error: error.message
        });
    }
});


router.post('/socialMediaInfo', async (req, res) => {
        const { userId, socialLinks } = req.body;
        const links = socialLinks || [];
        
        try {
          
          if (!userId || !Array.isArray(links) || links.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'Missing required fields: userId and socialLinks are required',
            });
          }
      
   
          // MongoDB- data save
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
        } catch (error) {
          console.error('Error in /socialMediaInfo:', error.message);
          res.status(500).json({
            success: false,
            message: 'Error updating social media links',
            error: error.message,
          });
        }
      });


router.post('/contactInfo', async(req, res) =>{
    const { userId, mapLocation, phoneNumber, email } = req.body;
    try {
        if (!userId || !mapLocation || !phoneNumber || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, mapLocation, phoneNumber, and email are required',
            });
        }

        // MongoDB- data save
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
    } catch (error) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        });
    }
})

router.get('/getContactData/:email', async(req, res) =>{
    try {
        const {email} = req.params;
    const userContactDataFind = await LastContact.findOne({email: email});
    res.status(200).json({message: 'contact data found', data:userContactDataFind})
    } catch (error) {
        console.error('Error in /contactInfo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error saving contact information',
            error: error.message,
        }); 
    }
    
})


module.exports = router;