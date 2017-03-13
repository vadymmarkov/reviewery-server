'use strict';

const mongoose = require('mongoose');
const Playlist = require('./playlist');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  playlists: [Playlist.schema]
}, { timestamps: true });

module.exports = mongoose.model('Chart', schema);
