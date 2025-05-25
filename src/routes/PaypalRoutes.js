const express = require('express');
const paypal = require('@paypal/checkout-server-sdk')
const router = express.Router();
const dotenv = require('dotenv');

const { default: Payment } = require('../models/PaymentModels');
dotenv.config();


// paypal configuration 
const environment = process.env.PAYPAL_ENV == 'sandbox' ? 
new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET) : 
paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

router.post('/create-order', async (req, res) => {
    const { price, userId, packageName, duration, currency = 'USD' } = req.body;
    // Validation
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }
    if (!userId || !packageName || !duration) {
      return res.status(400).json({ success: false, message: 'userId, packageName, and duration are required' });
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
      res.status(200).json({ success: true, orderID: response.result.id });
    } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
  });
  
  // Capture order
  router.post('/capture-order', async (req, res) => {
    const { orderID, userId, packageName, duration } = req.body;

    // Validation
    if (!orderID || !userId || !packageName || !duration ) {
      return res.status(400).json({ success: false, message: 'orderID, userId, packageName, and duration are required' });
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
      res.status(200).json({ success: true, data: savePaymentData });
    } catch (error) {
      console.error('Error capturing order:', error.message);
      res.status(500).json({ success: false, message: 'Failed to capture order', error: error.message });
    }
  });


module.exports = router;
