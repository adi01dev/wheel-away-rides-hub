const mongoose = require('mongoose');

const RideShareSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    joinLocation: {
      type: String
    }
  }],
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return new Date(v) > new Date(Date.now() + 2 * 60 * 60 * 1000);
      },
      message: 'Departure time must be at least 2 hours from now'
    }
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 3
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  visibleUntil: {
    type: Date,
    default: function() {
      return new Date(this.departureTime.getTime() - 2 * 60 * 60 * 1000);
    }
  }
});

RideShareSchema.methods.isVisible = function() {
  return new Date() < this.visibleUntil;
};

module.exports = mongoose.model('RideShare', RideShareSchema);
