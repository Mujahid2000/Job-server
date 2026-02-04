import express from 'express';
const router = express.Router();
import { sendNotification, customerMessage } from '../controller/livenotification.controller';

// POST: Shortlist Notification
router.post('/send', (req, res, next) => {
  req.body.type = 'shortlist';
  sendNotification(req, res, next);
});

// POST: Saved Profile Notification
router.post('/sendSavedProfile', (req, res, next) => {
  req.body.type = 'savedProfile';
  sendNotification(req, res, next);
});

// server/routes/apiRoutes.js
router.post('/customerMessage', customerMessage);

export default router;
