const express = require('express');
const SaveNotificationSchema = require('../models/SaveNotificationSchema');
const router = express.Router();

router.get('/notificationData/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await SaveNotificationSchema.aggregate([
  {
    $match: {
      applicantId: `${userId}`,
    },
  },
  {
    $lookup: {
      from: "companydatas",
      localField: "companyUser",
      foreignField: "userId",
      as: "result",
    },
  },
  {
    $unwind: {
      path: "$result",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $set: {
      companyName: "$result.companyName",
    },
  },
  {
    $project: {
      id: 1,
      applicantId: 1,
      jobId: 1,
      message: 1,
      Name: 1,
      companyUser: 1,
      companyName: 1,
      time:1
    },
  },
]);

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found' });
        }

        res.status(200).json({ message: 'Notification data retrieved', data: notifications });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;