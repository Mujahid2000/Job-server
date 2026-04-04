import { Request, Response, NextFunction } from "express";
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import UserSchema from '../models/UserModels';

const router = express.Router();

// Create tokens for a DB user. Accepts either { userId } or { email, password } in body.
router.post('/token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, email, password } = req.body || {};

        let user: any | null = null;

        if (userId) {
            user = await UserSchema.findById(userId);
        } else if (email && password) {
            user = await UserSchema.findOne({ email });
            if (!user) throw new ApiError(404, 'User not found');
            const valid = await user.isPasswordCorrect(password);
            if (!valid) throw new ApiError(401, 'Invalid credentials');
        } else {
            throw new ApiError(400, 'Provide userId or email and password');
        }

        if (!user) throw new ApiError(404, 'User not found');

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Persist the refresh token for later validation/rotation
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(200, { accessToken, refreshToken }, 'Tokens generated successfully')
        );
    } catch (err) {
        return next(err);
    }
});

// Refresh tokens securely using the stored refresh token on the user record
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body || {};
        if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

        let decoded: any;
        try {
            decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
        } catch (e) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const userId = decoded?.id || decoded?.data?.id;
        if (!userId) throw new ApiError(401, 'Invalid refresh token payload');

        const user = await UserSchema.findById(userId);
        if (!user) throw new ApiError(404, 'User not found');

        // Optional: ensure the stored refresh token matches (rotation)
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Refresh token mismatch');
        }

        const accessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Tokens refreshed successfully')
        );
    } catch (err) {
        return next(err);
    }
});

export default router;