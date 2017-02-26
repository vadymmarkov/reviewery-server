// models/track.js

'use strict';

const mongoose = require('mongoose');
const Review = require('./review');

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: { unique: true }
  },
  name: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  artist: {
    type: String,
    required: true
  },
  reviews: [Review.schema]
}, { timestamps: true });

module.exports = mongoose.model('tracks', schema);
