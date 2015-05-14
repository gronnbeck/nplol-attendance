var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var PORT = process.env.PORT || 8000;
var URI_MONGODB = process.env.MONGOLAB_URI || 'mongodb://localhost/nplol-attend';

mongoose.connect(MONGODB_URI)

var LastSeen = mongoose.model({
  username: String,
  lastSeen: String
});

var app = express();
app.use(bodyParser.json());

function create(message, next) {
  var lastSeen = new LastSeen({
    username: message.user_name,
    lastSeen: message.timestamp
  });

  lastSeen.save(function(err) {
    if (err) throw new Error('An error occured when trying to save new lastSeen');
    else return next();
  });
}

function update(doc, timestamp, next) {
  doc.lastSeen = timestamp;
  doc.save(function(err) {
    if (err) throw new Error('An error occured when trying to update lastSeen');
    else return next();
  })
}

app.post('/webhook/nplol', function (req, res) {
  var message = req.body;
  var username = message.user_name;
  var next = function() {
    return res.send({ success: true });
  }
  LastSeen.find({ username: username }).limit(1).exec(function(err, docs) {
    if (err) throw new Error(err);
    else if (docs.length == 0) return create(message, next)
    else return update(doc, message.timestamp, next);
  })
});

app.listen(PORT, function() {
  console.log('Server is running at ' + PORT)
});
