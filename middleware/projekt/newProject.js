/** Regisztrál egy új felhasználót ha az még nem létezik */
module.exports = function(objectRepository,logger){
    return function (req, res, next) {
	    var projektModel = objectRepository.projektModel;
        /**Létrehoz egy propjektet a megadott paraméterekkel és a létrehozó felhasználóval */
		var projekt = new projektModel({
        	title: req.body.title,
            description: req.body.description,
            owner: req.session.user.name
        });
		/**A hozzadás sikeressségét vizsgálja */
		projekt.save(function (err,result) {
		    /** Hiba esetén logolja 2-es status kóddal majd false értékkel visszatér */
  			if (err) {
			    logger(2,err);
                return res.status(500).send({error: "Error"});
  			}
            /**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és http 201-et küld visszatér */ 
            else {
			    logger(4,req.body.title + " created");	
                return res.status(201).send({project : result});
  			}
        /**Save vége */
		});
	/**function vége */
	};
/**module vége */
};