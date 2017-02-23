// models/review.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 0
  },
  track: {
    type: Schema.ObjectId,
    ref: 'Track'
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', schema);
