
const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const digilockerVerify = require('../middleware/digilockerVerify');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'documents') {
      cb(null, 'uploads/documents');
    } else if (file.fieldname === 'registration' || file.fieldname === 'insurance' || file.fieldname === 'puc') {
      cb(null, 'uploads/cardocs');
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

// Get all cars for admin
router.get('/admin', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const cars = await Car.find()
      .populate('owner', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    res.json(cars);
  } catch (error) {
    console.error('Admin get cars error:', error);
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
  { name: 'registration', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
  { name: 'puc', maxCount: 1 }
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
    let registrationFile = null;
    let insuranceFile = null;
    let pucFile = null;
    
    if (req.files) {
      if (req.files.images) {
        images = req.files.images.map(file => `/uploads/cars/${file.filename}`);
      }
      
      if (req.files.registration && req.files.registration[0]) {
        registrationFile = `/uploads/cardocs/${req.files.registration[0].filename}`;
      }
      
      if (req.files.insurance && req.files.insurance[0]) {
        insuranceFile = `/uploads/cardocs/${req.files.insurance[0].filename}`;
      }
      
      if (req.files.puc && req.files.puc[0]) {
        pucFile = `/uploads/cardocs/${req.files.puc[0].filename}`;
      }
    }
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one car image is required' });
    }
    
    if (!registrationFile || !insuranceFile || !pucFile) {
      return res.status(400).json({ message: 'All car documents (registration, insurance, PUC) are required' });
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
      documents: {
        registrationCertificate: {
          file: registrationFile,
          verified: false
        },
        insurance: {
          file: insuranceFile,
          verified: false
        },
        pucCertificate: {
          file: pucFile,
          verified: false
        }
      }
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

// Verify a car (admin only)
router.patch('/:id/verify', [auth, checkRole(['admin'])], async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
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
    
    res.json({ message: 'Car verified successfully', car });
  } catch (error) {
    console.error('Verify car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a car (owner or admin)
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
    
    await Car.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Car removed' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload car document
router.post('/:id/document/:docType', auth, upload.single('document'), async (req, res) => {
  try {
    const { id, docType } = req.params;
    
    if (!['registration', 'insurance', 'puc'].includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if user is the car owner or an admin
    if (car.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const filePath = `/uploads/cardocs/${req.file.filename}`;
    
    if (!car.documents) {
      car.documents = {};
    }
    
    // Update the appropriate document field
    if (docType === 'registration') {
      car.documents.registrationCertificate = {
        file: filePath,
        verified: false
      };
    } else if (docType === 'insurance') {
      car.documents.insurance = {
        file: filePath,
        verified: false
      };
    } else if (docType === 'puc') {
      car.documents.pucCertificate = {
        file: filePath,
        verified: false
      };
    }
    
    await car.save();
    
    res.json({
      message: `${docType} document uploaded successfully`,
      documentPath: filePath
    });
  } catch (error) {
    console.error('Car document upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify car document with Digilocker
router.post('/:id/verify/:docType', auth, digilockerVerify, async (req, res) => {
  try {
    const { id, docType } = req.params;
    
    if (!['registration', 'insurance', 'puc'].includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }
    
    // Get verification result from middleware
    const { success, data, error } = req.digilockerVerification;
    
    if (!success) {
      return res.status(400).json({ 
        message: 'Document verification failed', 
        error
      });
    }
    
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if user is the car owner or an admin
    if (car.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (!car.documents) {
      return res.status(400).json({ message: 'No documents found for this car' });
    }
    
    // Update the verification status
    if (docType === 'registration' && car.documents.registrationCertificate) {
      car.documents.registrationCertificate.verified = true;
      car.documents.registrationCertificate.verificationDate = new Date();
    } else if (docType === 'insurance' && car.documents.insurance) {
      car.documents.insurance.verified = true;
      car.documents.insurance.verificationDate = new Date();
    } else if (docType === 'puc' && car.documents.pucCertificate) {
      car.documents.pucCertificate.verified = true;
      car.documents.pucCertificate.verificationDate = new Date();
    } else {
      return res.status(400).json({ message: `${docType} document not found` });
    }
    
    // If all documents are verified, mark car as verified
    if (
      car.documents.registrationCertificate?.verified &&
      car.documents.insurance?.verified &&
      car.documents.pucCertificate?.verified
    ) {
      car.isVerified = true;
    }
    
    await car.save();
    
    res.json({
      message: `${docType} document verified successfully`,
      verificationData: data
    });
  } catch (error) {
    console.error('Car document verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
