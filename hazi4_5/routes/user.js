module.exports = function (app) {

var bodyParser = require('body-parser');
var login = require('../middleware/user/UserLogin');
var register = require('../middleware/user/UserRegister');
var userModel = require('../models/userModel');
var checkLogin = require('../middleware/user/CheckUserLogin');
var render = require('../middleware/generic/render');
var modifyUser = require('../middleware/user/modifyUser');
var logOut = require('../middleware/user/logOut');
app.use(bodyParser());
app.use( bodyParser.json() );

var objectRepository  = {
   userModel: userModel
}
app.get('/logOut', logOut());
app.post('/login', login(objectRepository));
app.post('/register', register(objectRepository));
app.post('/modifyUser',checkLogin(objectRepository),modifyUser(objectRepository));

};