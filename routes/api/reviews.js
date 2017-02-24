// routes/api/reviews.js

'use strict'

const express = require('express');
const router = express.Router();
const Review = rquire('../../models/review');

// Collection
router.route('/')
  // List
  .get((req, res) => {
    Review.find({}).sort({ createdAt: -1 }).exec()
    .then(function(reviews) {
      return res.json(reviews);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  // Update
  .post((req, res) => {
    const review = new Review({
      name: req.body.name
    });

    review.save()
      .then(function(review) {
        return res.json(review);
      })
      .catch(function(err){
        return res.send(err);
      });
  });

module.exports = router;
