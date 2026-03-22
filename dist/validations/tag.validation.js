"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagValidation = void 0;
const zod_1 = require("zod");
const postTag = zod_1.z.object({
    body: zod_1.z.object({
        tagName: zod_1.z.string().min(1),
    }),
});
exports.tagValidation = {
    postTag,
};
