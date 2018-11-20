# Description
[Node.js](https://nodejs.org) server for [Reviewery iOS application](https://github.com/vadymmarkov/reviewery-mobile).

**Reviewery** is an iOS application to rate songs in
[Spotify](https://www.spotify.com) playlists. It's a hobby project built in
[React Native](https://facebook.github.io/react-native/). Read more in my [Medium article](https://t.co/7qONtlRGxr).

# Packages
- [Express](http://expressjs.com) server framework
- [MongoDB](https://www.mongodb.com) as the primary database
- [Mongoose](http://mongoosejs.com) for object modelling.
- [passport-facebook-token](https://github.com/drudge/passport-facebook-token) as
a [Passport](http://passportjs.org) strategy for authenticating with
Facebook access tokens.
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) to
work with Spotify’s Web API

# API Endpoints

```sh
GET /api/users
GET /api/users/:id
GET /api/charts
GET /api/charts/:id
POST /api/charts
DELETE /api/charts/:id
PATCH /api/charts/:id/review
GET /api/charts/:id/top
GET /api/charts/:id/playlists
GET /api/charts/:chartId/playlists/:playlistId
DELETE /api/charts/:chartId/playlists/:playlistId
PATCH /api/charts/:chartId/playlists/:playlistId/review
GET /api/charts/:chartId/playlists/:playlistId/top
```

# Installation

After cloning this repo setup environment variables with [direnv](https://github.com/direnv/direnv)

```sh
cp .envrc-sample .envrc
direnv allow
npm install
DEBUG=myapp:* npm start
```

## Author

Vadym Markov, markov.vadym@gmail.com

## Contributing

Check the [CONTRIBUTING](https://github.com/vadymmarkov/reviewery-server/blob/master/CONTRIBUTING.md) file for more info.

## License

**Reviewery** is available under the MIT license. See the [LICENSE](https://github.com/vadymmarkov/reviewery-server/blob/master/LICENSE.md) file for more info.
