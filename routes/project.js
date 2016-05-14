
/**A projektekkel kapcsoaltos kéréseket továbbítja */
module.exports = function (app,logger) {
    /**Middlewarek */
    var checkprivilege =  require('../middleware/projekt/check_privilege'); 
    var checkLogin = require('../middleware/user/CheckUserLogin');
    var getProject = require('../middleware/projekt/getProject');
    var addProject = require('../middleware/projekt/newProject');
    var addUser = require('../middleware/projekt/addUser');
    var deleteUser = require('../middleware/projekt/deleteUser');
    var getProjectUsers = require('../middleware/projekt/getProjectUsers');
    var modifyProject = require('../middleware/projekt/changeProject');
    var deleteProject = require('../middleware/projekt/deleteProject');
    /**Modellek */
    var userModel = require('../models/userModel');
    var projectModel = require('../models/projectModel');
    var taskModel = require('../models/taskModel');
    /*Modelltár* */
    var objectRepository  = {
        userModel: userModel,
        projektModel: projectModel
    }
    /**Új projekt létrehozás csak bejelentkezett felhasználóknak */
    app.post('/project/addProject',checkLogin(objectRepository),addProject(objectRepository,logger));
    /**Új felhasználó hozzáadása egy projekthez jogosultság ellenőrzéssel */
    app.post('/project/addUser',checkLogin(objectRepository),checkprivilege(objectRepository,logger), addUser(objectRepository,logger));
    /**Felhasználók törlése a projectből jogosultság ellenőrzéssel */
    app.post('/project/deleteUser',checkLogin(objectRepository),checkprivilege(objectRepository,logger), deleteUser(objectRepository,logger));
    /**Projekt adatok módosítás jogosultság ellenőrzéssel */
    app.post('/project/modifyProject',checkLogin(objectRepository),checkprivilege(objectRepository,logger), modifyProject(objectRepository,logger));
    /**Projekt törlése jogosultság ellenőzéssel */
    app.post('/project/deleteProject',checkLogin(objectRepository),checkprivilege(objectRepository,logger), deleteProject(objectRepository,logger));
    /**Projekt adatainak lekérése jogosultság ellenőrzéssel */
    app.get('/project/getProject',checkLogin(objectRepository),getProject(objectRepository,logger));
    /**Projektben részvevő felhasználó lekérése jogosultság ellenőrzéssel */
    app.get('/project/getProjectUsers',checkLogin(objectRepository),checkprivilege(objectRepository,logger),getProjectUsers(objectRepository));
};   