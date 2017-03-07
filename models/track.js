'use strict';

const mongoose = require('mongoose');
const Review = require('./review');

const schema = new mongoose.Schema({
  trackId: {
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

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret, options) {
  if (options.userId) {
    var review = ret.reviews.filter(function (review) {
      return review.userId == options.userId;
    }).pop();

    if (review) {
      ret.rating = review.rating;
    }
  } else if (options.total) {
    var sum = ret.reviews.reduce(function (sum, review) {
      return sum + review.rating;
    }, 0);

    ret.rating = sum;
  }

  delete ret.reviews;

  return ret;
}

module.exports = mongoose.model('tracks', schema);
