 module.exports = function(objectRepository){
 	return function (req, res, next) {
/*
Megnézi, hogy a belépési adatok megfelelőek és ha igen akkor
belépteti majd továbbítja a főoldalra, ha nem akkor  hiaüzenetet küld, hogy nem megfelelőek az adatok.
*/
	var userModel = objectRepository.userModel;
	userModel.findOne({
      name: req.body.name
    }, function (err, result) {
      if ((err) || (!result)) {
                return res.status(401).send({error: 'Felhaszáló név vagy jelszó nem megfeleő'});
      }

      //check password
      if (result.password !== req.body.password) {
                return res.status(401).send({error: 'Felhaszáló név vagy jelszó nem megfeleő'});
      }

     req.session.id = result.id; 
      return res.sendStatus(200);
    });

 };


};