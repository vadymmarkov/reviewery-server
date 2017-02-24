// routes/api/playlist.js

'use strict'

const express = require('express');
const router = express.Router();
const Playlist = require('../../models/playlist');

// Collection
router.route('/')
  // List
  .get((req, res) => {
    Playlist.find({}).sort({ createdAt: -1 }).exec()
    .then(function(playlists) {
      return res.json(playlists);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  // Update
  .post((req, res) => {
    const playlist = new Playlist({
      name: req.body.name
    });

    playlist.save()
      .then(function(playlist) {
        return res.json(playlist);
      })
      .catch(function(err){
        return res.send(err);
      });
  });

// Single
router.route('/:id')
  .get((req, res) => {
    Playlist.findById(req.params.id).exec()
    .then(function(playlist) {
      return res.json(playlist);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  .put((req, res) => {
    Playlist.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    }, {new: true})
    .exec()
    .then(function(playlist) {
      return res.json(playlist);
    })
    .catch(function(err){
      return res.send(err);
    });
  })
  .delete((req, res) => {
    Playlist.remove({ _id: req.params.id }).exec()
    .then(function() {
      return res.json({ message: 'Playlist has been removed!' });
    })
    .catch(function(err){
      return res.send(err);
    });
  });

module.exports = router;
