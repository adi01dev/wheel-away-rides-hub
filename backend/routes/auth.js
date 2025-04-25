const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const digilockerVerify = require('../middleware/digilockerVerify');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Different folders based on document type
    if (file.fieldname === 'drivingLicense' || file.fieldname === 'identityProof') {
      cb(null, 'uploads/documents');
    } else {
      cb(null, 'uploads/profile');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password, // Will be hashed automatically due to pre-save hook
      role: role || 'user',
      phoneNumber
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload/profile', auth, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.profileImage = `/uploads/profile/${req.file.filename}`;
    await user.save();
    
    res.json({
      message: 'Profile picture uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload driving license
router.post('/upload/license', auth, upload.single('drivingLicense'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const filePath = `/uploads/documents/${req.file.filename}`;
    
    if (!user.documents) {
      user.documents = {};
    }
    
    user.documents.drivingLicense = {
      file: filePath,
      verified: false
    };
    
    await user.save();
    
    res.json({
      message: 'Driving license uploaded successfully',
      drivingLicense: filePath
    });
  } catch (error) {
    console.error('License upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload identity proof
router.post('/upload/identity', auth, upload.single('identityProof'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const filePath = `/uploads/documents/${req.file.filename}`;
    
    if (!user.documents) {
      user.documents = {};
    }
    
    user.documents.identityProof = {
      file: filePath,
      verified: false
    };
    
    await user.save();
    
    res.json({
      message: 'Identity proof uploaded successfully',
      identityProof: filePath
    });
  } catch (error) {
    console.error('Identity proof upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify document with Digilocker
router.post('/verify/document', auth, digilockerVerify, async (req, res) => {
  try {
    // Get verification result from middleware
    const { success, data, error } = req.digilockerVerification;
    
    if (!success) {
      return res.status(400).json({ 
        message: 'Document verification failed', 
        error
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user document verification status based on document type
    const { documentType } = req.body;
    
    if (!user.documents) {
      user.documents = {};
    }
    
    if (documentType === 'drivingLicense' && user.documents.drivingLicense) {
      user.documents.drivingLicense.verified = true;
      user.documents.drivingLicense.verificationDate = new Date();
    } else if (documentType === 'identityProof' && user.documents.identityProof) {
      user.documents.identityProof.verified = true;
      user.documents.identityProof.verificationDate = new Date();
    }
    
    // If both documents are verified, mark user as digilocker verified
    if (user.documents.drivingLicense?.verified && user.documents.identityProof?.verified) {
      user.digilockerVerified = true;
    }
    
    await user.save();
    
    res.json({
      message: 'Document verified successfully',
      verificationData: data
    });
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize Digilocker auth flow
router.get('/digilocker/auth', auth, (req, res) => {
  // In a real implementation, this would redirect to Digilocker OAuth flow
  // For demonstration purposes, we'll return a simulated auth URL
  const authUrl = `${process.env.DIGILOCKER_AUTH_URL || 'https://api.digitallocker.gov.in/oauth2/authorize'}?client_id=${process.env.DIGILOCKER_CLIENT_ID}&redirect_uri=${process.env.DIGILOCKER_REDIRECT_URI}&response_type=code&state=${req.user.userId}`;
  
  res.json({
    authUrl,
    message: 'Please navigate to this URL to authenticate with DigiLocker'
  });
});

// Digilocker OAuth callback
router.get('/digilocker/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ message: 'Invalid callback parameters' });
    }
    
    // In a real implementation:
    // 1. Exchange the code for a token
    // 2. Use the token to fetch user's verified documents
    // 3. Update the user's document verification status
    
    // For demonstration purposes, we'll simulate a successful verification
    const userId = state;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.digilockerVerified = true;
    await user.save();
    
    // In a real implementation, redirect to the frontend with a success message
    res.json({
      message: 'DigiLocker verification successful',
      userId
    });
  } catch (error) {
    console.error('DigiLocker callback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
