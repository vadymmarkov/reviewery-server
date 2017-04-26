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
GET /users
GET /users/:id
GET /charts
GET /charts/:id
POST /charts
DELETE /charts/:id
PATCH /charts/:id/review
GET /charts/:id/top
GET /charts/:id/playlists
GET /charts/:chartId/playlists/:playlistId
DELETE /charts/:chartId/playlists/:playlistId
PATCH /charts/:chartId/playlists/:playlistId/review
GET /charts/:chartId/playlists/:playlistId/top
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
