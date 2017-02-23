'use strict';

// Dependencies
const mongoose = require('mongoose');

// Set the database name
const dbUrl = load('MONGODB_URI');

// Connect to the database
mongoose.connect(dbUrl);

// Get notified if the connection was successful or not
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});
