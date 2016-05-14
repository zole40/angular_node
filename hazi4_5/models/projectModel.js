var Schema = require('mongoose').Schema;
var db = require('../config/db');

var Project = db.model('Project', {
  title: String,
  owner: String,
  description: String,
  users: Array
});

module.exports = Project