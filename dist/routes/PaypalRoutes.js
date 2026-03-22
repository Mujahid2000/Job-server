"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const paypal_controller_1 = require("../controller/paypal.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const paypal_validation_1 = require("../validations/paypal.validation");
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
router.post('/create-order', (0, validateMiddleware_1.default)(paypal_validation_1.paypalValidation.postPaypalOrderCreate), paypal_controller_1.payparOrderCreate);
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
router.post('/capture-order', (0, validateMiddleware_1.default)(paypal_validation_1.paypalValidation.postPaypalOrderCapture), paypal_controller_1.payparOrderCapture);
exports.default = router;
