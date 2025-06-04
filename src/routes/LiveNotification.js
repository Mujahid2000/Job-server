const express = require('express');
const NotificationSchemas = require('../models/NotificationSchema');
const SaveNotificationSchema = require('../models/SaveNotificationSchema');

const router = express.Router();
function formatDate(date) {
    const day = date.getDate();
    const suffix = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return 'st';
            case 2:  return 'nd';
            case 3:  return 'rd';
            default: return 'th';
        }
    };
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${day}${suffix(day)} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

/**
 * Shared handler to send notification
 */
const handleNotification = async (req, res, type) => {
  const { io } = req;
  const { id, companyUser, applicantId, jobId, message, Name } = req.body;

  // Validate required fields
  if (!id || !companyUser || !applicantId || !jobId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const notification = {
    id,
    companyUser,
    applicantId,
    jobId,
    message,
    Name,
    timestamp: () => formatDate(new Date()),
    type,
  };

  try {
    const userNotificationStatus = await NotificationSchemas.findOne({ userId: applicantId });

    if (!userNotificationStatus) {
      return res.status(404).json({ error: 'No notification record found for this user' });
    }

    // Check eligibility based on notification type
    const isAllowed =
      type === 'shortlist'
        ? userNotificationStatus.shortlist
        : userNotificationStatus.savedProfile;

    if (!isAllowed) {
      return res.status(200).json({ message: `Notification not sent: User is not eligible for ${type}` });
    }

    // Save to appropriate schema
    await SaveNotificationSchema.create(notification);

    // Emit via socket
    io.to(applicantId).emit('receiveNotification', notification);

    return res.status(200).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error(`Error sending ${type} notification:`, error);
    return res.status(500).json({ error: `Failed to send ${type} notification` });
  }
};

// POST: Shortlist Notification
router.post('/send', async (req, res) => {
  await handleNotification(req, res, 'shortlist');
});

// POST: Saved Profile Notification
router.post('/sendSavedProfile', async (req, res) => {
  await handleNotification(req, res, 'savedProfile');
});

module.exports = router;
