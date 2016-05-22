module.exports = function (app,logger) {

var bodyParser = require('body-parser');
var getTask = require('../middleware/task/getTask');
var getTasks = require('../middleware/task/getTasks');
var checkprivilege =  require('../middleware/projekt/check_privilege'); 
var checkLogin = require('../middleware/user/CheckUserLogin');
var getProject = require('../middleware/projekt/getProject');
var getProjectUsers = require('../middleware/projekt/getProjectUsers');
var userModel = require('../models/userModel');
var projectModel = require('../models/projectModel');
var taskModel = require('../models/taskModel');
var addTask = require('../middleware/task/newTask');
var findTaks = require('../middleware/task/findTasks');
var deleteTask = require('../middleware/task/deleteTask');
var modifyTask = require('../middleware/task/modifyTask');
var addTaskUser = require('../middleware/task/addUser');
var removeTaskUser = require('../middleware/task/removeUser');
var finish = require('../middleware/task/finishTask');
var getFinished = require('../middleware/task/getFinished')

var objectRepository  = {
   userModel: userModel,
   projektModel: projectModel,
   taskModel: taskModel
}
app.get('/task/getFreeTask',checkLogin(objectRepository),checkprivilege(objectRepository,logger),findTaks(objectRepository,logger), getTask(objectRepository));
app.get('/task/getTasks',checkLogin(objectRepository),checkprivilege(objectRepository,logger),findTaks(objectRepository,logger), getTasks(objectRepository));
app.get('/task/getFinished',checkLogin(objectRepository),checkprivilege(objectRepository,logger),findTaks(objectRepository,logger), getFinished(objectRepository));
app.post('/task/addTask',checkLogin(objectRepository),checkprivilege(objectRepository,logger), addTask(objectRepository,logger));
app.post('/task/deleteTask',checkLogin(objectRepository),checkprivilege(objectRepository,logger), deleteTask(objectRepository,logger));
app.post('/task/modifyTask',checkLogin(objectRepository),checkprivilege(objectRepository,logger), modifyTask(objectRepository,logger));
app.post('/task/addTaskUser',checkLogin(objectRepository),checkprivilege(objectRepository,logger), addTaskUser(objectRepository,logger));
app.post('/task/removeTaskUser',checkLogin(objectRepository),checkprivilege(objectRepository,logger), removeTaskUser(objectRepository,logger));
app.post('/task/finish',checkLogin(objectRepository),checkprivilege(objectRepository,logger), finish(objectRepository,logger));
};