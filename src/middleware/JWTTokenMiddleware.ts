import { Request, Response } from "express";
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const router = express.Router();

const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { data: user },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiration as any }
    );
    const refreshToken = jwt.sign(
        { data: user },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiration as any }
    );
    return { accessToken, refreshToken };
};

router.post('/token', async (req: Request, res: Response) => {
    const user = req.body;
    
    if (!user || Object.keys(user).length === 0) {
        throw new ApiError(400, 'User data is required');
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json(
        new ApiResponse(200, { accessToken, refreshToken }, 'Tokens generated successfully')
    );
});

router.post('/refresh', async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    }

    try {
        const decoded: any = jwt.verify(refreshToken, config.jwt.refreshSecret);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.data);

        res.status(200).json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Tokens refreshed successfully')
        );
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
});

export default router;