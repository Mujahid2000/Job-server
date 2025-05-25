const express = require('express');
const { default: Payment } = require('../models/PaymentModels');
const router = express.Router();



router.get('/subscriptions/:email', async (req, res) => {
    const { email } = req.params;
    console.log('Fetching payments for email:', email);

    try {
        const payments = await PaymentSchema.find({ email: email });
        if (payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this email' });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// New endpoint to fetch payment by custom ID
router.get('/subscription/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.find({ userId: id }); // Replace 'paymentId' with your custom field name
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment by id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;