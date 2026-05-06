import CompanyModel from "../models/CompanyModel";
import FounderInfoSchema from "../models/FounderInfoModel";
import ContactInfoSchema from "../models/ContactSchema";
import SocialMediaInfoSchema from "../models/SocialMediaModel";
import { cloudinaryUploadBuffer } from "../utils/FileUploader";
import { ApiError } from "../utils/ApiError";

const postCompanyData = async (companyData: any, files: { [fieldname: string]: Express.Multer.File[] }) => {
  const logoFile = files['logo']?.[0];
  const bannerFile = files['banner']?.[0];

  if (!logoFile || !bannerFile) {
    throw new ApiError(400, 'Logo and Banner are required');
  }

  const [logoResult, bannerResult]: any = await Promise.all([
    cloudinaryUploadBuffer(logoFile.buffer, logoFile.mimetype, 'image'),
    cloudinaryUploadBuffer(bannerFile.buffer, bannerFile.mimetype, 'image')
  ]);

  const newCompany = new CompanyModel({
    ...companyData,
    logo: logoResult.secure_url,
    banner: bannerResult.secure_url,
  });

  return await newCompany.save();
};

const postFounderInfo = async (founderData: any) => {
  console.log(founderData);
  const newFounder = new FounderInfoSchema(founderData);
  return await newFounder.save();
};

const postContactInfo = async (contactData: any) => {
  const { email, userId } = contactData;
  const newContact = await ContactInfoSchema.findOneAndUpdate(
    { $or: [{ email }, { userId }] },
    { $set: contactData },
    { upsert: true, new: true, runValidators: true }
  );
  return newContact;
};

const postSocialMediaInfo = async (socialData: any) => {
  const { userId, socialLinks } = socialData;
  const newSocial = await SocialMediaInfoSchema.findOneAndUpdate(
    { userId },
    { $set: { userId, socialLinks } },
    { upsert: true, new: true, runValidators: true }
  );
  return newSocial;
};

const getContactData = async (email: string) => {
  return await ContactInfoSchema.findOne({ email });
};

export const accountSetupService = {
  postCompanyData,
  postFounderInfo,
  postContactInfo,
  postSocialMediaInfo,
  getContactData,
};
