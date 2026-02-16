import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    if (!(err instanceof ApiError)) {
        // If it's not an instance of ApiError, we might want to wrap it or handle specific types
        // For example, Mongoose validation errors or JWT errors
        if (err.name === "ValidationError") {
            statusCode = 400;
            message = "Validation Error";
            errors = Object.values(err.errors).map((e: any) => e.message);
        } else if (err.name === "CastError") {
            statusCode = 400;
            message = "Invalid Resource ID";
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export { errorMiddleware };
