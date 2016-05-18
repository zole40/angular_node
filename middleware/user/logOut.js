 /**Kilépteti a felhasználót (törli a hozzá tartozó sessiont) */
 module.exports = function(logger){
 	return function (req, res, next) {
		 /**Logolja 4-es status kóddal, hogy kijelentkezett a felhasználó */
    	logger(4,req.session.user.name + " logged out");
		/**Törli a sessiont majd átirányít a kezdőoldalra */
    	req.session.destroy(function() {
      		res.clearCookie('connect.sid');
      		res.status(200).send();
    	/**destroy vége */
		});
	/**function vége */
	};
/**module vége */
};
