var Schema = require('mongoose').Schema;
var db = require('../config/db');

var Task = db.model('Task', {
  title: String,
  start: Date,
  end: Date,
  description: String,
  project: String,
  user: String
});

module.exports = Task