import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // optional: removes extra spaces
        unique: true // optional: prevent duplicates
    }
}, { timestamps: true });

const Tag = mongoose.model('Tag', TagsSchema);

export default Tag;
