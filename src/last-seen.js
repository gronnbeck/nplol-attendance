var mongoose = require('mongoose');

var LastSeen = mongoose.model('LastSeen', {
  username: String,
  lastSeen: String
});

module.exports = LastSeen;
