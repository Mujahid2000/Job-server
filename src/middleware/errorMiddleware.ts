import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { config } from "../config/config";
import { ZodError } from "zod";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errors = err.issues.map((issue: any) => ({
            path: issue.path,
            message: issue.message
        }));
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired! Please log in again.";
    } else if (!(err instanceof ApiError)) {
        if (err.name === "ValidationError") {
            statusCode = 400;
            message = "Validation Error";
            errors = Object.values((err as any).errors).map((e: any) => e.message);
        } else if (err.name === "CastError") {
            statusCode = 400;
            message = `Invalid ${(err as any).path}: ${(err as any).value}`;
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: config.env === "development" ? err.stack : undefined
    });
};

export { errorMiddleware };
