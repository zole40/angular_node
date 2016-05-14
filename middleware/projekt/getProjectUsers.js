 module.exports = function(objectRepository,logger){
  /* Lekérdezni a kívánt projekthez tartozó feladatokat és visszadja azokat amelyek már elvállata valaki*/
 	return function (req, res, next) {
      var projectModel = objectRepository.projektModel;
  	projectModel.findById(req.query.id,function (err, result) {
		/**Hiba esetén logolja 2-es status kóddal majd http 500-as választ küld */
			if(err){
				logger(2,err);
				return res.status(500).send({error: "Error"});
			}
    return res.json({ 'users': result.users });
    });
 };
 };