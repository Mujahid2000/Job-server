import express from 'express';
const router = express.Router();
import { getSubscriptionDataByEmail, getSubscriptionDataById } from '../controller/subscription.controller';


/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription and payment data management
 */

/**
 * @swagger
 * /data/payments/subscriptions/{email}:
 *   get:
 *     summary: Get subscription data by email
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription data fetched
 */
router.route('/subscriptions/:email').get(getSubscriptionDataByEmail);

/**
 * @swagger
 * /data/payments/subscription/{id}:
 *   get:
 *     summary: Get subscription data by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription data fetched
 */
router.route('/subscription/:id').get(getSubscriptionDataById);


export default router;