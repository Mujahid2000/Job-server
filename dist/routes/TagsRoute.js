"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const tag_controller_1 = require("../controller/tag.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const tag_validation_1 = require("../validations/tag.validation");
// Mock data for demonstration
/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Management of job tags
 */
/**
 * @swagger
 * /tags/postTags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     responses:
 *       201:
 *         description: Tag created successfully
 */
router.post('/postTags', (0, validateMiddleware_1.default)(tag_validation_1.tagValidation.postTag), tag_controller_1.postTag);
/**
 * @swagger
 * /tags/getTags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Tags fetched
 */
router.get('/getTags', tag_controller_1.getTags);
exports.default = router;
