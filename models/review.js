// models/review.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  track: {
    type: mongoose.Schema.ObjectId,
    ref: 'Track'
  }
}, { timestamps: true });

schema.index({ user: 1, track: -1 });

module.exports = mongoose.model('Review', schema);
