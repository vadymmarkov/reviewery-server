'use strict';

const mongoose = require('mongoose');
const User = require('./user');

const schema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', schema);
