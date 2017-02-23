// models/user.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', schema);
