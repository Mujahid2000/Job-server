import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
const paypal = require('@paypal/checkout-server-sdk')
const { default: Payment } = require('../models/PaymentModels');
const dotenv = require('dotenv');
dotenv.config();



// paypal configuration 
const environment = process.env.PAYPAL_ENV == 'sandbox' ?
  new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET) :
  paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);



const payparOrderCreate = asyncHandler(async (req: Request, res: Response) => {
  const { price, userId, packageName, duration, currency = 'USD' } = req.body;
  // Validation
  if (!price || isNaN(price) || price <= 0) {
    throw new ApiError(400, 'Invalid price');
  }
  if (!userId || !packageName || !duration) {
    throw new ApiError(400, 'userId, packageName, and duration are required');
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
    const response = await client.execute(request);
    res.status(200).json(
      new ApiResponse(200, { orderID: response.result.id }, 'Order created successfully')
    );
  } catch (error: any) {
    console.error('Error creating order:', error.message);
    throw new ApiError(500, 'Failed to create order', [error.message]);
  }
})


const payparOrderCapture = asyncHandler(async (req: Request, res: Response) => {
  const { orderID, userId, packageName, duration } = req.body;

  // Validation
  if (!orderID || !userId || !packageName || !duration) {
    throw new ApiError(400, 'orderID, userId, packageName, and duration are required');
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const response = await client.execute(request);
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

    const savePaymentData = await paymentsData.save();
    res.status(200).json(
      new ApiResponse(200, savePaymentData, 'Order captured and payment saved successfully')
    );
  } catch (error: any) {
    console.error('Error capturing order:', error.message);
    throw new ApiError(500, 'Failed to capture order', [error.message]);
  }
})


export {
  payparOrderCreate,
  payparOrderCapture
}