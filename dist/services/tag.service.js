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
exports.tagService = void 0;
const TagsSchema_1 = __importDefault(require("../models/TagsSchema"));
const ApiError_1 = require("../utils/ApiError");
const postTag = (tagName) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTag = yield TagsSchema_1.default.findOne({ tagName });
    if (existingTag) {
        throw new ApiError_1.ApiError(409, 'Tag already exists');
    }
    const newTag = new TagsSchema_1.default({ tagName });
    return yield newTag.save();
});
const getAllTags = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield TagsSchema_1.default.find();
});
exports.tagService = {
    postTag,
    getAllTags,
};
