"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subscription_controller_1 = require("../controller/subscription.controller");
const validateMiddleware_1 = __importDefault(require("../middleware/validateMiddleware"));
const subscription_validation_1 = require("../validations/subscription.validation");
const jobapplication_validation_1 = require("../validations/jobapplication.validation");
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
router.route('/subscriptions/:email').get((0, validateMiddleware_1.default)(jobapplication_validation_1.jobApplicationValidation.getParamsEmail), subscription_controller_1.getSubscriptionDataByEmail);
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
router.route('/subscription/:id').get((0, validateMiddleware_1.default)(subscription_validation_1.subscriptionValidation.getParamsId), subscription_controller_1.getSubscriptionDataById);
exports.default = router;
