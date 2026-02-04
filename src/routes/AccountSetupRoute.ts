import express from 'express';
const router = express.Router();
import multer from 'multer';
import {
    postCompanyInfo,
    postFounderInfo,
    postSocialMediaInfo,
    postContactInfo,
    getContactData
} from '../controller/accountsetup.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload an image to Cloudinary and save the URL in MongoDB
router.post('/companyInfo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), postCompanyInfo);

router.post('/founderInfo', postFounderInfo);

router.post('/socialMediaInfo', postSocialMediaInfo);

router.post('/contactInfo', postContactInfo);

router.get('/getContactData/:email', getContactData);

export default router;