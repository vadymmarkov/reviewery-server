// models/track.js

'use strict';

const mongoose = require('mongoose');

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
  artist: {
    type: String,
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { timestamps: true });

module.exports = mongoose.model('tracks', schema);
