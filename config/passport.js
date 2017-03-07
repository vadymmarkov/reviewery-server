'use strict';

const FacebookTokenStrategy = require('passport-facebook-token');
const passport = require('passport');
const User = require('../models/user');

// Auth strategy
passport.use(new FacebookTokenStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET']
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(
      {facebookId: profile.id},
      {name: profile.displayName},
      function(error, user, created) {
        return done(error, user);
      }
    );
  }
));

// Serialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
