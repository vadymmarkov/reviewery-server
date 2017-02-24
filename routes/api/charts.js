// routes/api/charts.js

'use strict'

const express = require('express');
const router = express.Router();
const Chart = require('../../models/chart');

// Collection
router.route('/')
  // List
  .get((req, res) => {
    Chart.find({}).sort({ createdAt: -1 }).exec()
    .then(function(charts) {
      return res.json(charts);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  // Update
  .post((req, res) => {
    const chart = new Chart({
      name: req.body.name
    });

    chart.save()
      .then(function(chart) {
        return res.json(chart);
      })
      .catch(function(err){
        return res.send(err);
      });
  });

// Single
router.route('/:id')
  .get((req, res) => {
    Chart.findById(req.params.id).exec()
    .then(function(chart) {
      return res.json(chart);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  .put((req, res) => {
    Chart.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }, {new: true})
    .exec()
    .then(function(chart) {
      return res.json(chart);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  .delete((req, res) => {
    Chart.remove({ _id: req.params.id }).exec()
    .then(function() {
      return res.json({ message: 'Chart has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

module.exports = router;
