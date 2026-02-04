import mongoose from "mongoose";

const profilePrivacySchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  profilePublic: {
    type: Boolean,
    default: false,
  },
  resumePublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProfilePrivacySchemas = mongoose.model('ProfilePrivacy', profilePrivacySchema);

export default ProfilePrivacySchemas;



