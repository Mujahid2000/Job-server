import Payment from '../models/PaymentModels';
import { ApiError } from "../utils/ApiError";
import paypal from '@paypal/checkout-server-sdk';
import { config } from '../config/config';

// PayPal client configuration
const environment = process.env.PAYPAL_ENV === 'sandbox' ?
    new paypal.core.SandboxEnvironment(config.paypal.clientId, config.paypal.clientSecret) :
    new paypal.core.LiveEnvironment(config.paypal.clientId, config.paypal.clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (orderData: any) => {
    const { price, packageName, duration, currency = 'USD' } = orderData;

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

    const response = await client.execute(request);
    return { orderID: response.result.id };
};

const captureOrder = async (captureData: any) => {
    const { orderID, userId, packageName, duration } = captureData;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await client.execute(request);
    const capture = response.result;

    const newPayment = new Payment({
        userId,
        orderID,
        packageName,
        duration,
        status: capture.status,
        price: parseFloat(capture.purchase_units[0].payments.captures[0].amount.value),
        currency: capture.purchase_units[0].payments.captures[0].amount.currency_code,
    });

    return await newPayment.save();
};

export const paypalService = {
    createOrder,
    captureOrder,
};
