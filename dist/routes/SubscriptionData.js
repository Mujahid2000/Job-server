"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const subscription_controller_1 = require("../controller/subscription.controller");
// get subscription by email
router.route('/subscriptions/:email').get(subscription_controller_1.getSubscriptionDataByEmail);
// get subscription by id
router.route('/subscription/:id').get(subscription_controller_1.getSubscriptionDataById);
exports.default = router;
