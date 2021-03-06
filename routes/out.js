/**Kiszolgálja az oldakat érintő GET kéréseket */
module.exports = function (app) {
    /**Modelek */
    var userModel = require('../models/userModel');
    
    /**Middlewarek */
    var checkLogin = require('../middleware/user/CheckUserLogin');
    
    /**Megjelenítés */
    var render = require('../middleware/generic/render');

    /**Objektumok */
    var objectRepository  = {
        userModel: userModel
    }

    /**Visszadja a kezdőoldalt (bejelentkező felület) */
    app.get('/', render(objectRepository,'index'));
    /**Bejelentkezett felhasználó esetén visszadja a kért oldalt, egyébként a kezdőoldalra irányít */   
    app.get('/calendar',checkLogin(objectRepository), render(objectRepository,'calendar') );
};