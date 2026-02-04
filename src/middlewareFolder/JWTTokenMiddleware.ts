import { Request, Response } from "express";

import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const secret = process.env.SECRET_TOKEN;
// Validate that secret is set
if (!secret) {
    throw new Error('SECRET_TOKEN is not defined in environment variables');
}

router.post('/token', async (req: Request, res: Response) => {
    try {
        const user = req.body;
        
        // Validate user payload
        if (!user || Object.keys(user).length === 0) {
            return res.status(400).json({ error: 'User data is required' });
        }
        const token = jwt.sign(
            { data: user },
            secret,
            { expiresIn: '1h' } // Use string for readability
        );
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;