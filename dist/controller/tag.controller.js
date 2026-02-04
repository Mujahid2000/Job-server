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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsController = void 0;
const TagsSchema_1 = __importDefault(require("../models/TagsSchema"));
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const tagsController = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagsList = yield TagsSchema_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(new ApiResponse_1.ApiResponse(200, tagsList, 'Tags fetched successfully'));
    }
    catch (error) {
        console.error('Error fetching tags:', error);
        throw new ApiError_1.ApiError(500, 'Error fetching tags', [error.message]);
    }
}));
exports.tagsController = tagsController;
