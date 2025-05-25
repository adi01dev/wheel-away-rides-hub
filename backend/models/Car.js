
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Economy', 'Compact', 'Midsize', 'SUV', 'Van', 'Luxury'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  // Adding currency for internationalization
  currency: {
    type: String,
    default: '₹',
    enum: ['₹', '$', '€', '£']
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  description: {
    type: String
  },
  features: [{
    type: String
  }],
  availableFrom: {
    type: Date,
    required: true
  },
  availableTo: {
    type: Date,
    required: true
  },
  documents: {
    registrationCertificate: {
      file: String,
      verified: {
        type: Boolean,
        default: true
      },
      verificationDate: Date
    },
    insurance: {
      file: String,
      verified: {
        type: Boolean,
        default: true
      },
      verificationDate: Date
    },
    pucCertificate: {
      file: String,
      verified: {
        type: Boolean,
        default: true
      },
      verificationDate: Date
    }
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema);
