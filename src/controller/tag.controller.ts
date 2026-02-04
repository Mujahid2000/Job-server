import { Request, Response } from "express";
import Tag from "../models/TagsSchema";
import { asyncHandler } from "../utils/AsyncHandler";


const tagsController = asyncHandler(async (req: Request, res: Response) => {
    try {
        const tagsList = await Tag.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Tags fetched successfully',
            data: tagsList
        });
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tags',
            error: error.message
        });
    }
})


export { tagsController }