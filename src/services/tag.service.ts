import TagsSchema from "../models/TagsSchema";
import { ApiError } from "../utils/ApiError";

const postTag = async (tagName: string) => {
    const existingTag = await TagsSchema.findOne({ tagName });
    if (existingTag) {
        throw new ApiError(409, 'Tag already exists');
    }

    const newTag = new TagsSchema({ tagName });
    return await newTag.save();
};

const getAllTags = async () => {
    return await TagsSchema.find();
};

export const tagService = {
    postTag,
    getAllTags,
};
