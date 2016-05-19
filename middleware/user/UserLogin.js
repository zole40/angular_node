/*
Megnézi, hogy a belépési adatok megfelelőek és ha igen akkor
belépteti majd továbbítja a főoldalra, ha nem akkor  hiaüzenetet küld, hogy nem megfelelőek az adatok.
*/
module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		/**User model */
		var userModel = objectRepository.userModel;
		/**Megkeresi a kívánt felhasználót */
		userModel.findOne({
    		name: req.body.name
    	}, function (err, result) {
			/**Hiba esetén logolj 2-es status kóddal azt majd http 500-at küld vissza */
     		if(err){
				logger(2,err);
			 	return res.status(500).secret({error: "Error"});
		 	}	
		 	/**Amennyiben a  felhasználó nem létezik logolja 1-es status kóddal majd http 401-et küld vissza */
		 	else if (!result) {
				logger(1,req.body.name + " nem létezik");
        		return res.status(401).send({error: 'Felhaszáló név vagy jelszó nem megfelelő'});
    		}
      		/**Ha jelszó nem megfelelő logolja 1-es status kóddal majd http 401-ez küld vissza */
     	 	if (result.password !== req.body.password) {
				logger(1,req.body.name + ": Hibás jelszó");
                return res.status(401).send({error: 'Felhaszáló név vagy jelszó nem megfelelő'});
     		}
	 		/**Amennyiben minden adat helyes beálítja a session sercret a felhasználó id-jére valamnit hozzáadja a sessionhöz a felhasználót mint object-et */
     		req.session.secret = result.id;
     		req.session.user = result;
	 		/**Logolja 4-es status kóddal, hogy a fehaszáló bejelentkezett majd http 200-at küld vissza (az angular miatt szükséges ez) */
     		logger(4,result.name + " has logged on");
      		return res.status(200).send({user : req.session.user});
    	/**userModel.find() vége */
		});
	 /**function vége */	
 	};
/**module vége */
};