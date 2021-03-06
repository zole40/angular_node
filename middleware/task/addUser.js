 /**Modosítja a feladat adatai amennyiben létezik hozzáadja a felhasználót*/
 module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		var taskModel = objectRepository.taskModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt feladat */
		taskModel.findById(req.body._id, function (err, result) {
        	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        	if(err){
			logger(2,err);
			return res.status(500).send({error :"Error"});
        	}
        	/**Ha nem létezik  a kívánt feladat akkor logolja 1-es status kóddal és http 404 küld vissza */
        	else if ((!result)) {
				logger(1,"A feladat (" + req.body._id + ') nem létezik');
          		return res.status(404).send({error: 'A feladat nem létezik'});
        	}
        	/**Ha létezik akkor megvizgálja van-e jogosultságunk módosítani, ha nem akkor http 403-at küld vissza */
          result.user = req.session.user.name;
          result.color = req.session.user.color;
        	if(result.save(function (err) {
				  /** Hiba esetén logolja 2-es statusal majd false értékkel visszatér */
  				if (err) {
					  logger(err);
						return false;
						/**Ha sikerült módosítani akkor logolja 4-es status kóddal és true értkékkel visszatér */
  				} else {
					logger(4,"Task ("+ req.query.id + " updated");
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