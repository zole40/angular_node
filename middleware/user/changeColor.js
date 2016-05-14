 /**Modosítja a felhasználó adatai amennyiben létezik a kivánt felhasználó és az a sajátunk */
 module.exports = function(objectRepository,logger){
	var changeTaskColor = require('../task/changeColor');
	return function (req, res, next) {
		var userModel = objectRepository.userModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt felhasználó */
		userModel.findOne({
      		name: req.session.user.name
  		}, function (err, result) {
        	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        	if(err){
			logger(2,err + "1" );
			return res.status(500).send({error :"Error"});
        	}
        	/**Ha nem létezik  a kívánt felhasználó akkor logolja 1-es status kóddal és http 404 küld vissza */
        	else if ((!result)) {
				logger(1,req.session.user.name + ' nem létezik');
          		return res.status(404).send({error: 'Felhaszáló nem létezik'});
        	}
      		result.color = req.body.color;
        	if(result.save(function (err) {
				  /** Hiba esetén logolja 2-es statusal majd false értékkel visszatér */
  				if (err) {
				    logger(2,err + "2");
					return false;
			    /**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és true értkékkel visszatér */
  				} else {
					logger(4,req.session.user.name + " updated");
					return true;
  				}
			})){
				/** Sikerült a módosíták akkor http 204-et küld vissza */
                req.session.user = result;
				/**Megváltoztatja a felhasználó feladatainak színét */
				changeTaskColor(objectRepository,logger)(result.name,req.body.color);
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