'use strict';

const Playlist = require('../models/playlist');
const Track = require('../models/track');

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
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
          id: data.body.id,
          name: data.body.name,
          href: data.body.href,
          imageUrl: data.body.images[0]["url"],
        });

        for (var i = 0; i < data.body.tracks.items.length; i++) {
          var item = data.body.tracks.items[i].track;
          var artist = "";

          for (var j = 0; j < item.artists.length; j++) {
            if (j > 0) {
              artist += ", "
            }
            artist += item.artists[j].name;
          }

          const track = new Track({
            id: item.id,
            name: item.name,
            href: item.href,
            imageUrl: item.album.images[1]["url"],
            artist: artist
          });

          playlist.tracks.push(track);
        }

        return playlist;
      });
  }
}
