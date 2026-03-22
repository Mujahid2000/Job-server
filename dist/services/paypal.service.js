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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalService = void 0;
const PaymentModels_1 = __importDefault(require("../models/PaymentModels"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const config_1 = require("../config/config");
// PayPal client configuration
const environment = process.env.PAYPAL_ENV === 'sandbox' ?
    new checkout_server_sdk_1.default.core.SandboxEnvironment(config_1.config.paypal.clientId, config_1.config.paypal.clientSecret) :
    new checkout_server_sdk_1.default.core.LiveEnvironment(config_1.config.paypal.clientId, config_1.config.paypal.clientSecret);
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, packageName, duration, currency = 'USD' } = orderData;
    const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
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
    const response = yield client.execute(request);
    return { orderID: response.result.id };
});
const captureOrder = (captureData) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderID, userId, packageName, duration } = captureData;
    const request = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const response = yield client.execute(request);
    const capture = response.result;
    const newPayment = new PaymentModels_1.default({
        userId,
        orderID,
        packageName,
        duration,
        status: capture.status,
        price: parseFloat(capture.purchase_units[0].payments.captures[0].amount.value),
        currency: capture.purchase_units[0].payments.captures[0].amount.currency_code,
    });
    return yield newPayment.save();
});
exports.paypalService = {
    createOrder,
    captureOrder,
};
