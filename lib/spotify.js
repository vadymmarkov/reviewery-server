'use strict';

const Playlist = require('../models/playlist');
const Track = require('../models/track');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env['SPOTIFY_CLIENT_ID'],
  clientSecret: process.env['SPOTIFY_CLIENT_SECRET']
});

module.exports = {
  getPlaylist: function(userId, playlistId) {
    // Retrieve an access token
    return spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        // Set the access token on the API object
        spotifyApi.setAccessToken(data.body['access_token']);
        // Get a playlist
        return spotifyApi.getPlaylist(userId, playlistId);
      })
      .then(function(data) {
        const playlist = new Playlist({
          playlistId: data.body.id,
          name: data.body.name,
          href: data.body.uri,
          imageUrl: data.body.images[0]["url"],
        });

        for (var i = 0; i < data.body.tracks.items.length; i++) {
          var item = data.body.tracks.items[i].track;
          var artist = "";

          for (var j = 0; j < item.artists.length; j++) {
            if (j > 0) {
              artist += ", ";
            }
            artist += item.artists[j].name;
          }

          const track = new Track({
            trackId: item.id,
            name: item.name,
            href: item.uri,
            imageUrl: item.album.images[1]["url"],
            artist: artist
          });

          playlist.tracks.push(track);
        }

        return playlist;
      });
  }
}
