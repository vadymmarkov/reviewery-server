// models/user.js

'use strict';

const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

const schema = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
    index: { unique: true }
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

schema.plugin(findOrCreate);

module.exports = mongoose.model('User', schema);
