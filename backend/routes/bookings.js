
const express = require('express');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

// Get all bookings for the current user
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('car', 'make model year category images')
      .populate('owner', 'name email phoneNumber')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for cars owned by the current user (host)
router.get('/my-car-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.userId })
      .populate('car', 'make model year category images')
      .populate('user', 'name email phoneNumber')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Get my car bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    
    // Find the car
    const car = await Car.findById(carId).populate('owner');
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Calculate total days and price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
      return res.status(400).json({ message: 'Invalid date range' });
    }
    
    const totalPrice = days * car.price;
    
    // Check if car is available for these dates
    if (start < car.availableFrom || end > car.availableTo) {
      return res.status(400).json({ message: 'Car not available for selected dates' });
    }
    
    // Check for existing bookings that overlap
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $nin: ['cancelled'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Car already booked for selected dates' });
    }
    
    // Create new booking
    const booking = new Booking({
      car: carId,
      user: req.user.userId,
      owner: car.owner._id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await booking.save();
    
    // Send email to both user and car owner
    try {
      // This is a mock email function - you'll need to implement actual email sending
      await sendEmail({
        to: req.user.email,
        subject: 'Car Booking Confirmation',
        text: `Your booking for ${car.make} ${car.model} has been received and is pending confirmation. Total price: $${totalPrice.toFixed(2)}`
      });
      
      await sendEmail({
        to: car.owner.email,
        subject: 'New Booking Request',
        text: `You have received a new booking request for your ${car.make} ${car.model}.`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with the booking creation even if email fails
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (host only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id)
      .populate('car', 'make model year category images')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the car owner
    if (booking.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    booking.status = status;
    await booking.save();
    
    // Send email notification
    try {
      await sendEmail({
        to: booking.user.email,
        subject: `Booking ${status === 'confirmed' ? 'Confirmed' : 'Cancelled'}`,
        text: `Your booking for ${booking.car.make} ${booking.car.model} has been ${status}.`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (for demo purposes)
router.patch('/:id/payment', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the booking user
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    booking.paymentStatus = 'paid';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
