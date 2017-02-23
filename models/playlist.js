// models/playlist.js

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
  }
  imageUrl: {
    type: String,
    default: null
  },
  chart: {
    type: Schema.ObjectId,
    ref: 'Chart'
  }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', schema);
