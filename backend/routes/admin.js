
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const RideShare = require('../models/RideShare');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Get all users (admin only)
router.get('/users', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all hosts (admin only)
router.get('/hosts', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    // Get all hosts
    const hosts = await User.find({ role: 'host' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Get car counts for each host
    const hostsWithCarCount = await Promise.all(
      hosts.map(async (host) => {
        const carCount = await Car.countDocuments({ owner: host._id });
        return {
          ...host.toObject(),
          carCount
        };
      })
    );
    
    res.json(hostsWithCarCount);
  } catch (error) {
    console.error('Get all hosts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all cars (admin only)
router.get('/cars', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(cars);
  } catch (error) {
    console.error('Get all cars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rides (admin only)
router.get('/rides', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const rides = await RideShare.find()
      .populate('driver', 'name profileImage')
      .populate('car', 'make model')
      .populate('passengers.user', 'name')
      .sort({ departureTime: -1 });
    
    res.json(rides);
  } catch (error) {
    console.error('Get all rides error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify a user (admin only)
router.patch('/verify-user/:userId', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.digilockerVerified = true;
    if (user.documents) {
      if (user.documents.drivingLicense) {
        user.documents.drivingLicense.verified = true;
        user.documents.drivingLicense.verificationDate = new Date();
      }
      if (user.documents.identityProof) {
        user.documents.identityProof.verified = true;
        user.documents.identityProof.verificationDate = new Date();
      }
    }
    
    await user.save();
    
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify a car (admin only)
router.patch('/verify-car/:carId', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    car.isVerified = true;
    if (car.documents) {
      if (car.documents.registrationCertificate) {
        car.documents.registrationCertificate.verified = true;
        car.documents.registrationCertificate.verificationDate = new Date();
      }
      if (car.documents.insurance) {
        car.documents.insurance.verified = true;
        car.documents.insurance.verificationDate = new Date();
      }
      if (car.documents.pucCertificate) {
        car.documents.pucCertificate.verified = true;
        car.documents.pucCertificate.verificationDate = new Date();
      }
    }
    
    await car.save();
    
    res.json({ message: 'Car verified successfully' });
  } catch (error) {
    console.error('Verify car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a ride (admin only)
router.patch('/cancel-ride/:rideId', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const ride = await RideShare.findById(req.params.rideId);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    ride.status = 'cancelled';
    await ride.save();
    
    res.json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (admin only)
router.delete('/user/:userId', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(req.params.userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
