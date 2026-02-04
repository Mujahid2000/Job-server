import mongoose from "mongoose";
// import { createIndexes } from './ApplicantModels';

const ResumeModel = new mongoose.Schema({
    userId:{
        type: String,
        index: true,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    resumeName: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        require: true
    }
})


const ResumeSchema = mongoose.model("ResumeCollection", ResumeModel);

export default ResumeSchema;