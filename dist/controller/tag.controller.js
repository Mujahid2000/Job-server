"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = exports.postTag = void 0;
const tag_service_1 = require("../services/tag.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const postTag = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tagName } = req.body;
    const result = yield tag_service_1.tagService.postTag(tagName);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, result, 'Tag saved successfully'));
}));
exports.postTag = postTag;
const getTags = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tag_service_1.tagService.getAllTags();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Tags fetched successfully'));
}));
exports.getTags = getTags;
