import express from 'express';
const router = express.Router();
import { sendNotification, customerMessage } from '../controller/livenotification.controller';

/**
 * @swagger
 * tags:
 *   name: Live Notifications
 *   description: Real-time notification services
 */

/**
 * @swagger
 * /liveNotification/send:
 *   post:
 *     summary: Send a shortlist notification
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post('/send', (req, res, next) => {
  req.body.type = 'shortlist';
  sendNotification(req, res, next);
});

/**
 * @swagger
 * /liveNotification/sendSavedProfile:
 *   post:
 *     summary: Send a saved profile notification
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Notification sent
 */
router.post('/sendSavedProfile', (req, res, next) => {
  req.body.type = 'savedProfile';
  sendNotification(req, res, next);
});

/**
 * @swagger
 * /liveNotification/customerMessage:
 *   post:
 *     summary: Send a customer message
 *     tags: [Live Notifications]
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post('/customerMessage', customerMessage);

export default router;
