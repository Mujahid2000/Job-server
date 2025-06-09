const express = require('express');
const NotificationSchemas = require('../models/NotificationSchema');
const SaveNotificationSchema = require('../models/SaveNotificationSchema');
const AdminChatMessageSaveForAdmin = require('../models/AdminChatMessageForUser');
const CustomerProfile = require('../models/CustomerProfile');

const router = express.Router();

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
    time: new Date(),
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


// server/routes/apiRoutes.js
router.post('/customerMessage', async (req, res) => {
  try {
    const { io } = req;
    const { senderId, role, message, id, email, name, isAdmin, receiverId, isRead } = req.body;

    // Basic validation
    if (!senderId || !message || !id || !role || !receiverId || !email || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const msgData = { senderId, role, message, id, email, name, isAdmin, receiverId, isRead, dateWithTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) };


 
      let findProfile = await CustomerProfile.findOne({ senderId });

      if (!findProfile) {
        if (!name || !email) {
          return res.status(400).json({ success: false, error: 'Name and email are required for new profile' });
        }

        const saveCustomerProfile = new CustomerProfile({ senderId, name, email });
        findProfile = await saveCustomerProfile.save();
      }
  

    // ✅ যে-ই হোক, তার receiverId অনুযায়ী মেসেজ পাঠিয়ে দাও
    io.to(receiverId).emit('message', msgData);

    // ✅ ডাটাবেজে সেভ করো
    const saveUserMessage = new AdminChatMessageSaveForAdmin(msgData);
    await saveUserMessage.save();

    return res.status(200).json({ success: true, data: msgData });

  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ success: false, error: 'Failed to save message' });
  }
});



module.exports = router;
