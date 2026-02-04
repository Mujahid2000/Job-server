import { Request, Response } from "express";
import Tag from "../models/TagsSchema";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";


const tagsController = asyncHandler(async (req: Request, res: Response) => {
    try {
        const tagsList = await Tag.find().sort({ createdAt: -1 });
        res.status(200).json(
            new ApiResponse(200, tagsList, 'Tags fetched successfully')
        );
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        throw new ApiError(500, 'Error fetching tags', [error.message]);
    }
})


export { tagsController }