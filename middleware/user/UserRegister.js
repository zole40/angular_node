/** Regisztrál egy új felhasználót ha az még nem létezik */
module.exports = function(objectRepository,logger){
 	return function (req, res, next) {
		var userModel = objectRepository.userModel;
		/* Megvizsgálja, hogy a felhasználó létezik-e már */
		userModel.findOne({
    		name: req.body.name
    	}, function (err, result) {
			/**Hiba  esetén logolja 2-es status kóddal majd http 500-at küld vissza */
			 if(err){
				logger(2,err);
				return res.status(500).send({error :"Error"});
			}
			/* Ha nem volt hiba és nem létezik a felhasználó akkor a megadott paraméterekkel megpróbálja léterhozni azt */
      		else if ((!result)) {
				var user = new userModel({
					name: req.body.name,
					password: req.body.password,
					address: req.body.address,
					email: req.body.email,
					color: "hsl(100,100,100)"	
				});
				/**A hozzadás sikeressségét vizsgálja */
				if(user.save(function (err) {
					/** Hiba esetén logolja 2-es status kóddal majd false értékkel visszatér */
  					if (err) {
						logger(2,err);
						return false;
					/**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és true értkékkel visszatér */
  					} else {
						logger(4,req.body.name + " registered");	
						return true;
  					}
				})){
					/**Ha sikerült hozzáadni a felhasználót akkor tovább hív akkor továbbadja a vezélést a következő middlewarenek */
					return next();
				}
			}
			/** Ha már létezik a felhasználó akkor logolja 1-es status kóddal hogy létezik majd http 409-et küld vissza */
			else{
				logger(1,req.body.name + " already exist");
				return res.status(409).send("A felhasználó létezik");
			}
		/**userModel.find vége */	
		});
	/**function vége */
	};
/**module vége */
};