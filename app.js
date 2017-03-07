var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./config/database');
require('./config/passport');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Routing
const apiRouter = express.Router();
apiRouter.use('/charts', require('./routes/api/charts'));
apiRouter.use('/users', require('./routes/api/users'));
app.use('/', require('./routes/index'));
app.use('/api', apiRouter)

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else if (!req.isAuthenticated()) {
    var err = new Error('User not logged in');
    err.status = 401;
    next(err);
  } else {
    next(err);
  }
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
