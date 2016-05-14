/**Projektek modellje */
var Schema = require('mongoose').Schema;
var db = require('../config/db');

/**Azadatbázisban tárolt modell */
var Project = db.model('project', {
	title: String,
	owner: String,
	description: String,
	users: Array
},'project');

module.exports = Project