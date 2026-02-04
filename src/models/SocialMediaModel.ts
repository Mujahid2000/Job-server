import mongoose from "mongoose";

const SocialMediaSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  socialLinks: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const SocialMedia = mongoose.model("SocialMediaInfo", SocialMediaSchema);

export default SocialMedia;
