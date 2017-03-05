// routes/api/charts.js

'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chart = require('../../models/chart');
const Playlist = require('../../models/playlist');
const Review = require('../../models/review');
const spotifyApi = require('../../lib/spotify');
var passport = require('passport');

// Collection
router.route('/')
  // List
  .get(passport.authenticate('facebook-token'), function (req, res) {
    Chart.find({})
    .select('name playlists')
    .sort({ createdAt: -1 }).exec()
    .then(function(charts) {
      return res.json(charts.map(function(chart){
        return {
          _id: chart._id,
          name: chart.name,
          playlistsCount: chart.playlists.length
        };
      }));
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  // Create
  .post(passport.authenticate('facebook-token'), function (req, res) {
    const chart = new Chart({
      name: req.body.name
    });

    chart.save()
      .then(function(chart) {
        return res.status(201).send({
          success: true,
          message: "Chart has been created!",
        });
      })
      .catch(function(err){
        return res.send(err);
      });
  });

// Single
router.route('/:id')
  .get(passport.authenticate('facebook-token'), function (req, res) {
    Chart.findById(req.params.id)
    .select('name playlists')
    .exec()
    .then(function(chart) {
      return res.json({
        _id: chart._id,
        name: chart.name,
        playlists: chart.playlists.map(function(playlist){
          return {
            _id: playlist._id,
            name: playlist.name,
            imageUrl: playlist.imageUrl,
            tracksCount: playlist.tracks.length
          }
        })
      });
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  .put(passport.authenticate('facebook-token'), function (req, res) {
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
  .delete(passport.authenticate('facebook-token'), function (req, res) {
    Chart.remove({ _id: req.params.id }).exec()
    .then(function() {
      return res.json({ message: 'Chart has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

router.route('/:chartId/playlists')
  // Create
  .post(passport.authenticate('facebook-token'), function (req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      return spotifyApi.getPlaylist(req.body.userId, req.body.playlistId)
      .then(function(playlist) {
        chart.playlists.push(playlist);
        return chart.save();
      })
    })
    .then(function(chart) {
      return res.status(201).send({
        success: true,
        message: "Playlist has been created!",
      });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

router.route('/:chartId/playlists/:playlistId')
  // Playlist detail
  .get(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findOne({
      _id: req.params.chartId,
      'playlists._id': req.params.playlistId
    })
    .select('playlists')
    .exec()
    .then(function(chart) {
      var playlist = chart.playlists.pop();
      var userId = req.user._id.toString();
      return res.json(playlist.toJSON({ userId: userId, transform: true }));
    })
    .catch(function(err) {
      return res.send(err);
    });
  })
  // Delete playlist
  .delete(passport.authenticate('facebook-token'), function (req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      chart.playlists.id(playlistId).remove();
      return chart.save();
    })
    .then(function() {
      return res.json({ message: 'Playlist has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

router.route('/:chartId/playlists/:playlistId/review/:trackId')
  // Add review
  .post(passport.authenticate('facebook-token'), function(req, res) {
    var userId = req.user._id.toString()
    var rating = req.body.rating

    Chart.findById(req.params.chartId)
    .where('playlists.tracks.reviews', {$elemMatch: {userId: userId }})
    .exec()
    .then(function(chart) {
      if (chart != null) {
        var error = new Error("Track can't be reviewed twice by the same user!");
        error.status = 400;
        throw error;
      }

      if (!rating || rating < 0 || req.body.rating > 10) {
        var error = new Error("Invalid rating!");
        error.status = 400;
        throw error;
      }

      return Chart.findById(req.params.chartId)
    })
    .then(function(chart) {
      var playlistId = req.params.playlistId;
      var trackId = req.params.trackId;
      const review = new Review({
        rating: rating,
        userId: userId
      });

      chart.playlists.id(playlistId).tracks.id(trackId).reviews.push(review);
      return chart.save();
    })
    .then(function(chart) {
      return res.status(201).send({
        message: "Track has been reviewed!",
      });
    })
    .catch(function(err){
      return res.status(err.status).send({
        message: err.message,
      });
    });
  });

module.exports = router;
