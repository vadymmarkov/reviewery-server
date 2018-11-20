'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chart = require('../../models/chart');
const Playlist = require('../../models/playlist');
const Review = require('../../models/review');
const spotifyApi = require('../../lib/spotify');
var passport = require('passport');

// Charts
router.route('/')
  // Chart list
  .get(passport.authenticate('facebook-token'), function(req, res) {
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
  // Create a chart
  .post(passport.authenticate('facebook-token'), function(req, res) {
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

// A single chart
router.route('/:id')
  // Fetch a chart
  .get(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.id)
    .select('name isReviewed playlists')
    .exec()
    .then(function(chart) {
      return res.json({
        _id: chart._id,
        name: chart.name,
        isReviewed: chart.isReviewed,
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
  // Delete a chart
  .delete(passport.authenticate('facebook-token'), function(req, res) {
    Chart.remove({ _id: req.params.id }).exec()
    .then(function() {
      return res.json({ message: 'Chart has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

// Review a chart
router.route('/:chartId/review')
  .patch(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findByIdAndUpdate(req.params.chartId, {
      isReviewed: true,
    }, {new: true})
    .exec()
    .then(function(chart) {
      return res.status(201).send({
        message: "Chart has been reviewed!",
      });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

// Chart top tracks
router.route('/:chartId/top')
  .get(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      if (chart.isReviewed) {
        let trackArrays = chart.playlists.map(function(playlist){
          return playlist.tracks;
        });
        let tracks = [].concat.apply([], trackArrays)
          .map(function(track){
            return track.toJSON({ total: true, transform: true })
          })
          .sort(function(a, b) {
            return b.rating - a.rating;
          });

        return res.json(tracks);
      }

      res.json([]);
    })
    .catch(function(err){
      return res.send(err);
    });
  })

// Playlists
router.route('/:chartId/playlists')
  // Create a playlist
  .post(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      return spotifyApi.getPlaylist(req.body.playlistId)
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

// A single playlist
router.route('/:chartId/playlists/:playlistId')
  // Playlist detail
  .get(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      var playlist = chart.playlists.id(req.params.playlistId);
      var userId = req.user._id.toString();
      return res.json(playlist.toJSON({ userId: userId, transform: true }));
    })
    .catch(function(err) {
      return res.send(err);
    });
  })
  // Delete a playlist
  .delete(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      chart.playlists.id(req.params.playlistId).remove();
      return chart.save();
    })
    .then(function() {
      return res.json({ message: 'Playlist has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

// Review a playlist
router.route('/:chartId/playlists/:playlistId/review')
  .patch(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      chart.playlists.id(req.params.playlistId).isReviewed = true;
      return chart.save();
    })
    .then(function(chart) {
      return res.status(201).send({
        message: "Playlist has been reviewed!",
      });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

// Playlist top tracks
router.route('/:chartId/playlists/:playlistId/top')
  .get(passport.authenticate('facebook-token'), function(req, res) {
    Chart.findById(req.params.chartId).exec()
    .then(function(chart) {
      var playlist = chart.playlists.id(req.params.playlistId);

      if (playlist.isReviewed) {
        let tracks = playlist.tracks
          .map(function(track){
            return track.toJSON({ total: true, transform: true })
          }).sort(function(a, b) {
            return b.rating - a.rating;
          });
        return res.json(tracks);
      }

      res.json([]);
    })
    .catch(function(err) {
      return res.send(err);
    });
  });

// Add a track review
router.route('/:chartId/playlists/:playlistId/review/:trackId')
  .post(passport.authenticate('facebook-token'), function(req, res) {
    var userId = req.user._id.toString();
    var playlistId = req.params.playlistId;
    var trackId = req.params.trackId;
    var rating = req.body.rating;

    Chart.findById(req.params.chartId)
    .exec()
    .then(function(chart) {
      if (!rating || rating < 0 || req.body.rating > 12) {
        var error = new Error("Invalid rating!");
        error.status = 400;
        throw error;
      }

      return chart;
    })
    .then(function(chart) {
      let reviews = chart.playlists.id(playlistId).tracks.id(trackId).reviews;
      let userReview = reviews.filter(function(review) {
        return review.userId === userId;
      }).pop();

      if (userReview != null) {
        var error = new Error("Track can't be reviewed twice by the same user!");
        error.status = 400;
        throw error;
      }

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
      const status = err.status ? err.status : 500;
      return res.status(status).send({
        message: err.message
      });
    });
  });

module.exports = router;
