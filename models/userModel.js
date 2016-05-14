/**Felhasználó modellje */
var Schema = require('mongoose').Schema;
var db = require('../config/db');

/**Azadatbázisban tárolt modell */
var User = db.model('users', {
 	name: String,
 	email: String,
 	password: String,
 	address: String,
 	color: String
},'users');

module.exports = User