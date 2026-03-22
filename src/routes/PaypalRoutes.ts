import express from 'express';
const router = express.Router();
import { payparOrderCreate, payparOrderCapture } from '../controller/paypal.controller';
import validate from '../middleware/validateMiddleware';
import { paypalValidation } from '../validations/paypal.validation';

/**
 * @swagger
 * tags:
 *   name: PayPal
 *   description: PayPal payment integration
 */

/**
 * @swagger
 * /paypal/create-order:
 *   post:
 *     summary: Create a PayPal order
 *     tags: [PayPal]
 *     responses:
 *       200:
 *         description: Order created
 */
router.post('/create-order', validate(paypalValidation.postPaypalOrderCreate), payparOrderCreate);

/**
 * @swagger
 * /paypal/capture-order:
 *   post:
 *     summary: Capture a PayPal order
 *     tags: [PayPal]
 *     responses:
 *       200:
 *         description: Order captured
 */
router.post('/capture-order', validate(paypalValidation.postPaypalOrderCapture), payparOrderCapture);


export default router;
