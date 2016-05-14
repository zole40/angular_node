/**Feladatok modelje */
var Schema = require('mongoose').Schema;
var db = require('../config/db');

/**Az adatbázisban tárolt model */
var Task = db.model('Task', {
	title: String,
	start: Date,
	description: String,
	project: String,
	user: String,
	color: String,
	finished: Boolean
},'task');

module.exports = Task