
const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const checkRole = require('../middleware/checkRole');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'documents') {
      cb(null, 'uploads/documents');
    } else {
      cb(null, 'uploads/cars');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png and .pdf files are allowed'));
  }
});

// Get all cars with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      location,
      sortBy
    } = req.query;
    
    let query = {};
    
    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (availableFrom && availableTo) {
      query.availableFrom = { $lte: new Date(availableFrom) };
      query.availableTo = { $gte: new Date(availableTo) };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Apply sorting
    let sort = { createdAt: -1 }; // Default sort by newest
    if (sortBy === 'price_asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sort = { price: -1 };
    } else if (sortBy === 'rating') {
      sort = { 'ratings.average': -1 };
    }
    
    const cars = await Car.find(query)
      .populate('owner', 'name profileImage')
      .sort(sort);
    
    res.json(cars);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single car by id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('owner', 'name email phoneNumber profileImage');
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new car (host only)
router.post('/', [auth, checkRole(['host', 'admin'])], upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 5 }
]), async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      category,
      price,
      location,
      description,
      features,
      availableFrom,
      availableTo
    } = req.body;
    
    // Process uploaded files
    let images = [];
    let documents = [];
    
    if (req.files) {
      if (req.files.images) {
        images = req.files.images.map(file => `/uploads/cars/${file.filename}`);
      }
      
      if (req.files.documents) {
        documents = req.files.documents.map(file => `/uploads/documents/${file.filename}`);
      }
    }
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one car image is required' });
    }
    
    // Create new car
    const car = new Car({
      owner: req.user.userId,
      make,
      model,
      year: parseInt(year),
      category,
      price: parseFloat(price),
      location,
      description,
      features: features ? JSON.parse(features) : [],
      availableFrom: new Date(availableFrom),
      availableTo: new Date(availableTo),
      images,
      documents
    });
    
    await car.save();
    
    res.status(201).json(car);
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a car (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if user is the car owner or an admin
    if (car.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const {
      price,
      description,
      features,
      availableFrom,
      availableTo
    } = req.body;
    
    // Update fields
    if (price) car.price = parseFloat(price);
    if (description) car.description = description;
    if (features) car.features = JSON.parse(features);
    if (availableFrom) car.availableFrom = new Date(availableFrom);
    if (availableTo) car.availableTo = new Date(availableTo);
    
    await car.save();
    
    res.json(car);
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a car
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if user is the car owner or an admin
    if (car.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await car.remove();
    
    res.json({ message: 'Car removed' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
