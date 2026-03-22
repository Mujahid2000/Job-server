import { Request, Response } from "express";
import { tagService } from "../services/tag.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

const postTag = asyncHandler(async (req: Request, res: Response) => {
    const { tagName } = req.body;
    const result = await tagService.postTag(tagName);
    res.status(201).json(
        new ApiResponse(201, result, 'Tag saved successfully')
    );
});

const getTags = asyncHandler(async (req: Request, res: Response) => {
    const result = await tagService.getAllTags();
    res.status(200).json(
        new ApiResponse(200, result, 'Tags fetched successfully')
    );
});

export { postTag, getTags };