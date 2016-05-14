 /**Megnézi, hogy létezik-e a kért project és van van-e jogosultságunk hozzáférni */
 module.exports = function(objectRepository,logger){
 	return function (req, res, next) {

		var projectModel = objectRepository.projektModel;
		var owner = true;
		/**Lekéri a kívánt azonosítójú projectet */
		projectModel.findById(req.query.id,function (err, result) {
			/**Hiba esetén logolja 2-es status kóddal majd http 500-as választ küld */
			if(err){
				logger(2,err);
				return res.status(500).send({error: "Error"});
			}
			/**Ha a kívánt project nem létezik logolja 1-es status kóddal majd http 404-es választ küld */
      		else if (!result) {
				logger(1,"Project (" + req.query.id + ") not found");
        		return res.status(404).send({error: 'Project nem létezik'});
      		}
			  /**Ha létezik a project akkor megnézi, hogy a felhasználónak van-e hozzáférése a projekthez */
			for(i in result.users){
				if(req.session.user.name === result.users[i]){
					owner = false;
					break;
				}
			}
			/**Ha nincs hozzá férése és nem ő a tulajdonos akkor logolja azt 1-es status kóddal majd htpp 401-el tér vissza */
      		if (result.owner !== req.session.user.name && owner) {
				logger(1,req.session.user.name + " access denied to project (" + req.query.id + ")");
            	return res.status(401).send({error: 'Hozzáférés megtagadva!'});
			}
			/**Ha van hozzáférése akkor beállítja hogy tulajdonos-e */
			else{
				next.owner = owner;	
			}
			/** Továbbadja a vezérlést a következő middlewarenek */
			return next();
		/**find() vége */
    	});
	/**function vége */
	};
/**Module vége */
 };
