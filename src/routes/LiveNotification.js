const express = require('express');
const NotificationSchemas = require('../models/NotificationSchema');
const router = express.Router();

// POST endpoint to send notifications
router.post('/send', async (req, res) => {
  const { io } = req; // Get io from request object
  const { id, companyUser, applicantId, jobId, message, Name } = req.body;

  // Validate request body
  if (!id || !companyUser || !applicantId || !jobId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create notification object
  const notification = {
    id,
    companyUser,
    applicantId,
    jobId,
    message,
    Name,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check notification status in database
    const checkNotificationStatus = await NotificationSchemas.findOne({ userId: applicantId });

    if (!checkNotificationStatus) {
      return res.status(404).json({ error: 'No notification record found for this user' });
    }

    if (checkNotificationStatus.shortlist !== true) {
      return res.status(200).json({ message: 'Notification not sent: User is not shortlisted' });
    }

    // Save notification to database
    // await NotificationSchemas.create(notification);

    // Emit notification to specific user via Socket.IO
    io.to(applicantId).emit('receiveNotification', notification);

    // Respond to the client
    res.status(200).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});


router.post('/sendSavedProfile', async (req, res) => {
  const { io } = req; // Get io from request object
  const { id, companyUser, applicantId, jobId, message, Name } = req.body;

  // Validate request body
  if (!id || !companyUser || !applicantId || !jobId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create notification object
  const notification = {
    id,
    companyUser,
    applicantId,
    jobId,
    message,
    Name,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check notification status in database
    const checkNotificationStatus = await NotificationSchemas.findOne({ userId: applicantId });

    if (!checkNotificationStatus) {
      return res.status(404).json({ error: 'No notification record found for this user' });
    }

    if (checkNotificationStatus.savedProfile !== true) {
      return res.status(200).json({ message: 'Notification not sent: User is not shortlisted' });
    }

    // Save notification to database
    // await NotificationSchemas.create(notification);

    // Emit notification to specific user via Socket.IO
    io.to(applicantId).emit('receiveNotification', notification);

    // Respond to the client
    res.status(200).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;