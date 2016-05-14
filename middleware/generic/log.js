/**Logolja a bejövő kéréseket */
module.exports = function (logger) {
	return function (req, res,next) {
    	/**Ha megvizsgálja, hogy bejelentkezett felhasználó küldt-e a kérést */
		if(req.session.user === undefined){
			/**Ha nem akkor logolja 1-es status kóddal */
    		logger(1,"anonimus: " + req.method + " " + req.url);
    	}
    	else{
			/**Ha igen akkor logolja 3-as status kóddal */
			logger(3,req.session.user.name + " " + req.method + " " + req.url);
    	}
    	next();
	};
};