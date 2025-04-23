
const express = require('express');
const RideShare = require('../models/RideShare');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

// Get all available ride shares
router.get('/', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    
    let query = { status: 'scheduled' };
    
    if (source) {
      query.source = { $regex: source, $options: 'i' };
    }
    
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    
    if (date) {
      // Match rides on the same day
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureTime = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(nextDay.setHours(0, 0, 0, 0))
      };
    }
    
    const rideShares = await RideShare.find(query)
      .populate('driver', 'name profileImage')
      .populate('car', 'make model year category images')
      .sort({ departureTime: 1 });
    
    res.json(rideShares);
  } catch (error) {
    console.error('Get ride shares error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ride share by id
router.get('/:id', async (req, res) => {
  try {
    const rideShare = await RideShare.findById(req.params.id)
      .populate('driver', 'name email phoneNumber profileImage')
      .populate('car', 'make model year category images')
      .populate('passengers.user', 'name profileImage');
    
    if (!rideShare) {
      return res.status(404).json({ message: 'Ride share not found' });
    }
    
    res.json(rideShare);
  } catch (error) {
    console.error('Get ride share error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new ride share
router.post('/', auth, async (req, res) => {
  try {
    const {
      source,
      destination,
      departureTime,
      availableSeats,
      price,
      carId
    } = req.body;
    
    // If car ID provided, verify it belongs to the user
    let car = null;
    if (carId) {
      car = await Car.findOne({ _id: carId, owner: req.user.userId });
      if (!car) {
        return res.status(400).json({ message: 'Invalid car selection' });
      }
    }
    
    // Create new ride share
    const rideShare = new RideShare({
      driver: req.user.userId,
      source,
      destination,
      departureTime: new Date(departureTime),
      availableSeats: parseInt(availableSeats) || 3,
      price: parseFloat(price),
      status: 'scheduled',
      car: car ? car._id : null
    });
    
    await rideShare.save();
    
    res.status(201).json(rideShare);
  } catch (error) {
    console.error('Create ride share error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Request to join a ride share
router.post('/:id/join', auth, async (req, res) => {
  try {
    const { joinLocation } = req.body;
    const rideShare = await RideShare.findById(req.params.id);
    
    if (!rideShare) {
      return res.status(404).json({ message: 'Ride share not found' });
    }
    
    // Check if user is already in passengers list
    const existingPassenger = rideShare.passengers.find(
      p => p.user.toString() === req.user.userId
    );
    
    if (existingPassenger) {
      return res.status(400).json({ message: 'You have already requested to join this ride' });
    }
    
    // Check if there are available seats
    const pendingAndAccepted = rideShare.passengers.filter(
      p => p.status !== 'rejected'
    ).length;
    
    if (pendingAndAccepted >= rideShare.availableSeats) {
      return res.status(400).json({ message: 'No seats available' });
    }
    
    // Add user to passengers
    rideShare.passengers.push({
      user: req.user.userId,
      status: 'pending',
      joinLocation: joinLocation || rideShare.source
    });
    
    await rideShare.save();
    
    // Notify driver
    try {
      // This would be replaced with your actual email implementation
      await sendEmail({
        to: 'driver@example.com', // In real app, you'd get the driver's email
        subject: 'New Ride Share Request',
        text: `Someone has requested to join your ride from ${rideShare.source} to ${rideShare.destination}.`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Join ride share error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update passenger status (driver only)
router.patch('/:id/passengers/:passengerId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const rideShare = await RideShare.findById(req.params.id);
    
    if (!rideShare) {
      return res.status(404).json({ message: 'Ride share not found' });
    }
    
    // Check if user is the driver
    if (rideShare.driver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Find and update passenger status
    const passengerIndex = rideShare.passengers.findIndex(
      p => p._id.toString() === req.params.passengerId
    );
    
    if (passengerIndex === -1) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    rideShare.passengers[passengerIndex].status = status;
    await rideShare.save();
    
    res.json({ message: `Passenger ${status}` });
  } catch (error) {
    console.error('Update passenger status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a ride share (driver only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const rideShare = await RideShare.findById(req.params.id);
    
    if (!rideShare) {
      return res.status(404).json({ message: 'Ride share not found' });
    }
    
    // Check if user is the driver
    if (rideShare.driver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Instead of removing, set status to cancelled
    rideShare.status = 'cancelled';
    await rideShare.save();
    
    res.json({ message: 'Ride share cancelled' });
  } catch (error) {
    console.error('Cancel ride share error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
