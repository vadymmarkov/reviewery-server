'use strict';

// Dependencies
const mongoose = require('mongoose');

// Set the database name
const dbUrl = process.env['MONGODB_URI'];

// Connect to the database
mongoose.connect(dbUrl);

// Set Promise provider to bluebird
mongoose.Promise = require('bluebird');

// Get notified if the connection was successful or not
const db = mongoose.connection;

mongoose.plugin(schema => { schema.options.usePushEach = true });

db.once('open', () => {
  console.log(`Connected to the ${dbUrl} database`);
});

db.on('error', () => {
  console.log(`Connot connect to the ${dbUrl} database`);
});
