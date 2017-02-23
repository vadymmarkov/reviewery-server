// models/track.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
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
  }
}, { timestamps: true });

module.exports = mongoose.model('tracks', schema);
