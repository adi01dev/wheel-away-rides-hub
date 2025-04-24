
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user'
  },
  phoneNumber: {
    type: String
  },
  profileImage: {
    type: String
  },
  documents: {
    drivingLicense: {
      file: String,
      verified: {
        type: Boolean,
        default: false
      },
      verificationDate: Date
    },
    identityProof: {
      file: String,
      verified: {
        type: Boolean,
        default: false
      },
      verificationDate: Date
    }
  },
  digilockerVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
