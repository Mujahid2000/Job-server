"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const config_1 = require("../config/config");
const zod_1 = require("zod");
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            path: issue.path,
            message: issue.message
        }));
    }
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired! Please log in again.";
    }
    else if (!(err instanceof ApiError_1.ApiError)) {
        if (err.name === "ValidationError") {
            statusCode = 400;
            message = "Validation Error";
            errors = Object.values(err.errors).map((e) => e.message);
        }
        else if (err.name === "CastError") {
            statusCode = 400;
            message = `Invalid ${err.path}: ${err.value}`;
        }
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: config_1.config.env === "development" ? err.stack : undefined
    });
};
exports.errorMiddleware = errorMiddleware;
