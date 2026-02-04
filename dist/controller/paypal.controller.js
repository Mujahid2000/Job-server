"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payparOrderCapture = exports.payparOrderCreate = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const paypal = require('@paypal/checkout-server-sdk');
const { default: Payment } = require('../models/PaymentModels');
const dotenv = require('dotenv');
dotenv.config();
// paypal configuration 
const environment = process.env.PAYPAL_ENV == 'sandbox' ?
    new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET) :
    paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);
const payparOrderCreate = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, userId, packageName, duration, currency = 'USD' } = req.body;
    // Validation
    if (!price || isNaN(price) || price <= 0) {
        throw new ApiError_1.ApiError(400, 'Invalid price');
    }
    if (!userId || !packageName || !duration) {
        throw new ApiError_1.ApiError(400, 'userId, packageName, and duration are required');
    }
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['prefer'] = 'return=representation';
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: currency,
                    value: price.toString(),
                },
                description: `Subscription: ${packageName} (${duration})`,
            },
        ],
    });
    try {
        const response = yield client.execute(request);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, { orderID: response.result.id }, 'Order created successfully'));
    }
    catch (error) {
        console.error('Error creating order:', error.message);
        throw new ApiError_1.ApiError(500, 'Failed to create order', [error.message]);
    }
}));
exports.payparOrderCreate = payparOrderCreate;
const payparOrderCapture = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderID, userId, packageName, duration } = req.body;
    // Validation
    if (!orderID || !userId || !packageName || !duration) {
        throw new ApiError_1.ApiError(400, 'orderID, userId, packageName, and duration are required');
    }
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    try {
        const response = yield client.execute(request);
        const capture = response.result;
        // Save payment to MongoDB
        const paymentsData = new Payment({
            userId,
            orderID,
            packageName,
            duration,
            status: capture.status,
            price: parseFloat(capture.purchase_units[0].payments.captures[0].amount.value),
            currency: capture.purchase_units[0].payments.captures[0].amount.currency_code,
        });
        const savePaymentData = yield paymentsData.save();
        res.status(200).json(new ApiResponse_1.ApiResponse(200, savePaymentData, 'Order captured and payment saved successfully'));
    }
    catch (error) {
        console.error('Error capturing order:', error.message);
        throw new ApiError_1.ApiError(500, 'Failed to capture order', [error.message]);
    }
}));
exports.payparOrderCapture = payparOrderCapture;
