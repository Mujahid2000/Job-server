const mongoose = require('mongoose');

// Define the Payment schema
const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    required: [true, 'User ID is required'],
  },
  orderID: {
    type: String,
    trim: true,
    required: [true, 'Order ID is required'],
    unique: true, // Ensure orderID is unique
  },
  packageName: {
    type: String,
    trim: true,
    required: [true, 'Package name is required'],
  },
  duration: {
    type: String,
    trim: true,
    required: [true, 'Duration is required'],
  },
  status: {
    type: String,
    trim: true,
    required: [true, 'Status is required'],
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'APPROVED'], // Match PayPal statuses
    default: 'PENDING',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  currency: {
    type: String,
    trim: true,
    default: 'USD',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for faster queries
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ orderID: 1 });

// Export the model
const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;