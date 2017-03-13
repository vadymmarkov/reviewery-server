'use strict';

const mongoose = require('mongoose');
const Track = require('./track');

const schema = new mongoose.Schema({
  playlistId: {
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
  isReviewed: {
    type: Boolean,
    default: false
  },
  tracks: [Track.schema]
}, { timestamps: true });

module.exports = mongoose.model('Playlist', schema);
