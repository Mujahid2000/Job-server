const express = require('express');
const Tag = require('../models/TagsSchema');


const router = express.Router();

// Mock data for demonstration


// Get all tags
router.get('/tagsName', async (req, res) => {
    try {
        const tagsList = await Tag.find().sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: 'Tags fetched successfully',
            data: tagsList
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tags',
            error: error.message
        });
    }
});

module.exports = router;
