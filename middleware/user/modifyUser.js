 /**Modosítja a felhasználó adatai amennyiben létezik a kivánt felhasználó és az a sajátunk */
 module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		var userModel = objectRepository.userModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt felhasználó */
		userModel.findOne({
      		name: req.body.name
  		}, function (err, result) {
        	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        	if(err){
			logger(2,err);
			return res.status(500).send({error :"Error"});
        	}
        	/**Ha nem létezik  a kívánt felhasználó akkor logolja 1-es status kóddal és http 404 küld vissza */
        	else if ((!result)) {
				logger(1,req.body.name + ' nem létezik');
          		return res.status(404).send({error: 'Felhaszáló nem létezik'});
        	}
        	/**Ha létezik akkor megvizgálja, hogy a saját felhasználónkat szeretnénk-e módosítani, ha nem akkor http 403-at küld vissza */
        	if(result.id != req.session.secret){
				logger(1,req.session.user.name + " tried update another user");
          		return res.status(403).send("Access denied");
        	}
      		result.password = req.body.password,
			result.address = req.body.address,
			result.email = req.body.email	
        	if(result.save(function (err) {
				  /** Hiba esetén logolja 2-es statusal majd false értékkel visszatér */
  				if (err) {
					  logger(err);
						return false;
						/**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és true értkékkel visszatér */
  				} else {
					logger(4,req.body.name + " updated");
					req.session.user = result;
					return true;
  				}
			})){
				/** Sikerült a módosíták akkor http 204-et küld vissza */
          		return res.status(204).send("Updated");
        	}
			/**Ha nem sikerült akkor http 500-at küld vissza */
        	else{
          		return res.status(500).send({error:"Error"});
       	 	}
		/**userModel.find() vége */
    	});
	/** function vége */
  	};
/**module vége */
};