"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const accountsetup_controller_1 = require("../controller/accountsetup.controller");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
// Route to upload an image to Cloudinary and save the URL in MongoDB
router.post('/companyInfo', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), accountsetup_controller_1.postCompanyInfo);
router.post('/founderInfo', accountsetup_controller_1.postFounderInfo);
router.post('/socialMediaInfo', accountsetup_controller_1.postSocialMediaInfo);
router.post('/contactInfo', accountsetup_controller_1.postContactInfo);
router.get('/getContactData/:email', accountsetup_controller_1.getContactData);
exports.default = router;
