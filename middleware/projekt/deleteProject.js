 /**Törli a projectet adatai amennyiben létezik a kivánt felhasználó és az a sajátunk */
 module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		var projektModel = objectRepository.projektModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt felhasználó */
		projektModel.findById(req.query.id, function (err, result) {
        	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        	if(err){
			logger(2,err);
			return res.status(500).send({error :"Error"});
        	}
        	/**Ha nem létezik  a kívánt project akkor logolja 1-es status kóddal és http 404 küld vissza */
        	else if ((!result)) {
				logger(1,"A project (" + req.query.id + ') nem létezik');
          		return res.status(404).send({error: 'A project nem létezik'});
        	}
        	/**Ha létezik akkor megvizgálja van-e jogosultságunk törölni, ha nem akkor http 403-at küld vissza */
        	if(result.owner != req.session.user.name){
				logger(1,req.session.user.name + "Access denied to project" + result.id);
          		return res.status(403).send("Access denied");
        	}
        	if(result.remove(function (err) {
				  /** Hiba esetén logolja 2-es statusal majd false értékkel visszatér */
  				if (err) {
					  logger(err);
					  return false;
						/**Ha sikerült törölni az adatbázisból akkor logolja 4-es status kóddal és true értkékkel visszatér */
  				} else {
					logger(4,"Project ("+ req.query.id + " removed");
					return true;
  				}
			})){
				/**Ha sikerült a törlés akkor http 204-et küld vissza */
          		return res.status(204).send();
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