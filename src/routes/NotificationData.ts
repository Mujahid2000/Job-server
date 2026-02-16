import express from 'express';
const router = express.Router();
import {
  getNotificationData,
  sendNotificationCustomerProfile,
  customerMessageForAdmin,
  adminMessageForCustomer
} from
  '../controller/notificationdata.controller';


/**
 * @swagger
 * tags:
 *   name: Notification Data
 *   description: Management of notification data and messages
 */

/**
 * @swagger
 * /notification/notificationData/{userId}:
 *   get:
 *     summary: Get notification data for a user
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification data fetched
 */
router.route('/notificationData/:userId').get(getNotificationData);

/**
 * @swagger
 * /notification/customerProfile/{senderId}:
 *   get:
 *     summary: Get notification for a customer profile sender
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification data fetched
 */
router.route('/customerProfile/:senderId').get(sendNotificationCustomerProfile);

/**
 * @swagger
 * /notification/customerMessageForAdmin/{customerId}:
 *   get:
 *     summary: Get customer messages for admin
 *     tags: [Notification Data]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer messages fetched
 */
router.route('/customerMessageForAdmin/:customerId').get(customerMessageForAdmin)

/**
 * @swagger
 * /notification/adminMessageForCustomer:
 *   get:
 *     summary: Get admin messages for customers
 *     tags: [Notification Data]
 *     responses:
 *       200:
 *         description: Admin messages fetched
 */
router.route('/adminMessageForCustomer').get(adminMessageForCustomer);


export default router;