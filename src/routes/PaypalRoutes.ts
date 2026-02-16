import express from 'express';
const router = express.Router();
import { payparOrderCreate, payparOrderCapture } from '../controller/paypal.controller';



/**
 * @swagger
 * tags:
 *   name: Payments (PayPal)
 *   description: PayPal payment integration
 */

/**
 * @swagger
 * /api/paypal/create-order:
 *   post:
 *     summary: Create a PayPal order
 *     tags: [Payments (PayPal)]
 *     responses:
 *       200:
 *         description: PayPal order created
 */
router.route('/create-order').post(payparOrderCreate);

/**
 * @swagger
 * /api/paypal/capture-order:
 *   post:
 *     summary: Capture a PayPal order
 *     tags: [Payments (PayPal)]
 *     responses:
 *       200:
 *         description: PayPal order captured
 */
router.route('/capture-order').post(payparOrderCapture);


export default router;
