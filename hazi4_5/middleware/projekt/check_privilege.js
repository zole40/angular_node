 module.exports = function(objectRepository){

 	return function (req, res, next) {
/*
  Megnézi, hogy létezik-e a kért project és van van-e jogosultságunk elkérni a hozzá tartozó feladatokat.
*/
	var projectModel = objectRepository.projectModel;
	var taskModel = objectRepository.taskModel;
	/*projectModel.findOne({
      name: req.body.id
    }, function (err, result) {
      if ((err) || (!result)) {
                return res.status(400).send({error: 'Project nem létezik'});
      }
      if (result.owner !== req.body.name || !user(req.body.name)) {
            return res.status(401).send({error: 'Hozzáférés megtagadva!'});
      }
    });*/
 return next();
}

 };
