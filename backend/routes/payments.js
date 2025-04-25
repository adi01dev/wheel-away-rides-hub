
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order for payment
router.post('/create-order', auth, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
});

// Verify and complete payment
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      amount,
      paymentMethod
    } = req.body;
    
    // Create payment record
    const payment = new Payment({
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      amount: amount / 100, // Convert back from paise to rupees
      status: 'completed',
      paymentMethod
    });
    
    await payment.save();
    
    // Update booking payment status
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid'
    });
    
    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
