 /**Modosítja a project adatai amennyiben létezik a kivánt felhasználó és az a sajátunk */
 module.exports = function(objectRepository,logger){
	return function (req, res, next) {
    if(next.owner){
		var taskModel = objectRepository.taskModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt felhasználó */
		taskModel.findById(req.body._id, function (err, result) {
        	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        	if(err){
			logger(2,err);
			return res.status(500).send({error :"Error"});
        	}
        	/**Ha nem létezik  a kívánt project akkor logolja 1-es status kóddal és http 404 küld vissza */
        	else if ((!result)) {
				logger(1,"A feladat (" + req.body._id + ') nem létezik');
          		return res.status(404).send({error: 'A feladat nem létezik'});
        	}
        	/**Ha létezik akkor megvizgálja van-e jogosultságunk módosítani, ha nem akkor http 403-at küld vissza */
          result.title = req.body.title;
          result.description = req.body.description;
          result.start = req.body.start;
          result.finished = req.body.finished;
        	if(result.save(function (err) {
				  /** Hiba esetén logolja 2-es statusal majd false értékkel visszatér */
  				if (err) {
					  logger(err);
						return false;
						/**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és true értkékkel visszatér */
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
    }
    else{
      logger(1,"Acces denied to project(" + req.query.id + ")");
      return res.status(403).send("Access denied");
    }
	/** function vége */
  	};
/**module vége */
};