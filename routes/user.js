/**Továbbítja a felhasználóval kapcsolatos kéréseket a megfelelő middlewarek felé */
module.exports = function (app,logger) {
	
	/**Modelek */
	var userModel = require('../models/userModel');
	var taskModel = require('../models/taskModel');	
		
	/**Middlewarek */
	var login = require('../middleware/user/UserLogin');
	var register = require('../middleware/user/UserRegister');
	var checkLogin = require('../middleware/user/CheckUserLogin');
	var modifyUser = require('../middleware/user/modifyUser');
	var logOut = require('../middleware/user/logOut');
	var changeColor = require('../middleware/user/changeColor');
	var getUser = require('../middleware/user/getUser');
	var getAll = require('../middleware/user/getAll');
	/**Megjelenítés */
	var render = require('../middleware/generic/render');
		
	/**Modell gyűjtemény */
	var objectRepository  = {
   		userModel: userModel,
		taskModel: taskModel
	}
	
	/**Kijelentkezés: Megvizsgálja, hogy be van-e jelentkezve ha igen akkor kijelentkezteti */
	app.post('/user/logOut', checkLogin(objectRepository,logger),logOut(logger));
	/**Bejelentkezés */
	app.post('/user/login', login(objectRepository,logger));
	/**Regisztráció: Regisztrálja a felhasználót és ha ez sikerült akkor be is lépteti */
	app.post('/user/register', register(objectRepository,logger),login(objectRepository,logger));
	/**Módisítás: Megjelenítés, hogy be van-e jelentkezve ha igen akkor továbbengedi a módosításhoz */
	app.post('/user/modifyUser',checkLogin(objectRepository,logger),modifyUser(objectRepository,logger));
	app.post('/user/changeColor',checkLogin(objectRepository,logger),changeColor(objectRepository,logger));
	app.get('/user/getUser',checkLogin(objectRepository,logger),getUser());
	app.get('/user/getAll',checkLogin(objectRepository,logger),getAll(objectRepository,logger));
};