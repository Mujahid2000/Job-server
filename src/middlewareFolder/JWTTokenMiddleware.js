const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const secret = process.env.SECRET_TOKEN;
// Validate that secret is set
if (!secret) {
    throw new Error('SECRET_TOKEN is not defined in environment variables');
}

router.post('/token', async (req, res) => {
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

module.exports = router;