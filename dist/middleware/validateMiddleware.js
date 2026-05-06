"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessage = error.issues
                .map((details) => details.message)
                .join(', ');
            return next(new ApiError_1.ApiError(400, errorMessage));
        }
        return next(error);
    }
};
exports.default = validate;
