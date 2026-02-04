import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema(
  {
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    education: {
      type: String,
      required: true
    },
    portfolio: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }

  },
  { timestamps: true }
);

export default mongoose.model("Applicant", ApplicantSchema);
