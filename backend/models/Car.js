
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
        default: false
      },
      verificationDate: Date
    },
    insurance: {
      file: String,
      verified: {
        type: Boolean,
        default: false
      },
      verificationDate: Date
    },
    pucCertificate: {
      file: String,
      verified: {
        type: Boolean,
        default: false
      },
      verificationDate: Date
    }
  },
  isVerified: {
    type: Boolean,
    default: false
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
