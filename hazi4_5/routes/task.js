module.exports = function (app) {

var bodyParser = require('body-parser');
var getTask = require('../middleware/projekt/getTask');
var getTasks = require('../middleware/projekt/getTasks');
var checkprivilege =  require('../middleware/projekt/check_privilege'); 
var checkLogin = require('../middleware/user/CheckUserLogin');
var getProject = require('../middleware/projekt/getProject');
var getProjectUsers = require('../middleware/projekt/getProjectUsers');
var userModel = require('../models/userModel');
var projectModel = require('../models/projectModel');
var taskModel = require('../models/taskModel');
var objectRepository  = {
   userModel: userModel,
   projektModel: projectModel,
   taskModel: taskModel
}
app.get('/getTask',checkLogin(objectRepository),checkprivilege(objectRepository), getTask(objectRepository));
app.get('/getTasks',checkLogin(objectRepository),checkprivilege(objectRepository), getTasks(objectRepository));
app.get('/getProject',checkLogin(objectRepository),checkprivilege(objectRepository),getProject(objectRepository));
app.get('/getProjectUsers',checkLogin(objectRepository),checkprivilege(objectRepository),getProjectUsers(objectRepository));
};