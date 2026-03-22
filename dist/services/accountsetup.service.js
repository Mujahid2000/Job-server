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
exports.accountSetupService = void 0;
const CompanyModel_1 = __importDefault(require("../models/CompanyModel"));
const FounderInfoModel_1 = __importDefault(require("../models/FounderInfoModel"));
const ContactSchema_1 = __importDefault(require("../models/ContactSchema"));
const SocialMediaModel_1 = __importDefault(require("../models/SocialMediaModel"));
const FileUploader_1 = require("../utils/FileUploader");
const ApiError_1 = require("../utils/ApiError");
const postCompanyData = (companyData, files) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const logoFile = (_a = files['logo']) === null || _a === void 0 ? void 0 : _a[0];
    const bannerFile = (_b = files['banner']) === null || _b === void 0 ? void 0 : _b[0];
    if (!logoFile || !bannerFile) {
        throw new ApiError_1.ApiError(400, 'Logo and Banner are required');
    }
    const [logoResult, bannerResult] = yield Promise.all([
        (0, FileUploader_1.cloudinaryUploadBuffer)(logoFile.buffer, logoFile.mimetype, 'image'),
        (0, FileUploader_1.cloudinaryUploadBuffer)(bannerFile.buffer, bannerFile.mimetype, 'image')
    ]);
    const newCompany = new CompanyModel_1.default(Object.assign(Object.assign({}, companyData), { logo: logoResult.secure_url, banner: bannerResult.secure_url }));
    return yield newCompany.save();
});
const postFounderInfo = (founderData) => __awaiter(void 0, void 0, void 0, function* () {
    const newFounder = new FounderInfoModel_1.default(founderData);
    return yield newFounder.save();
});
const postContactInfo = (contactData) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = new ContactSchema_1.default(contactData);
    return yield newContact.save();
});
const postSocialMediaInfo = (socialData) => __awaiter(void 0, void 0, void 0, function* () {
    const newSocial = new SocialMediaModel_1.default(socialData);
    return yield newSocial.save();
});
const getContactData = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ContactSchema_1.default.findOne({ email });
});
exports.accountSetupService = {
    postCompanyData,
    postFounderInfo,
    postContactInfo,
    postSocialMediaInfo,
    getContactData,
};
