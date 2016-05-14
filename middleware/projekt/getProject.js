/**Lekérdezi a projekteket melyekhez a felhasználnak van hozzférése */
 module.exports = function(objectRepository,logger){
 	return function (req, res, next) {
  		var projectModel = objectRepository.projektModel;
  		projectModel.find({$or: [{owner : req.session.user.name},{users : req.session.user.name}]},function (err, result) {
		/**Hiba esetén logolja 2-es status kóddal majd http 500-as választ küld */
			if(err){
				logger(2,err);
				return res.status(500).send({error: "Error"});
			}
			/**Egy json objectet küld vissza az eredményhalmazzal */
			return res.json({"projects": result});
		/**find() vége */
		});
	/**function vége */
	};
/**module vége */
};