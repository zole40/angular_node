module.exports = function (app) {

var bodyParser = require('body-parser');
var userModel = require('../models/userModel');
var checkLogin = require('../middleware/user/CheckUserLogin');
var render = require('../middleware/generic/render');
app.use(bodyParser());
app.use( bodyParser.json() );

var objectRepository  = {
   userModel: userModel
}

app.get('/', render(objectRepository,'index'));
app.get('/project',checkLogin(objectRepository), render(objectRepository,'project') );
app.get('/admin', checkLogin(objectRepository), render(objectRepository,'admin')); 
app.get('/profile',checkLogin(objectRepository), render(objectRepository,'profile'));
app.get('/calendar',checkLogin(objectRepository), render(objectRepository,'calendar') );

};