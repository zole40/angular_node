 module.exports = function(objectRepository,logger){
 	/* Lekérdezni a kívánt projekteh tertozó feladatokat és visszadja azokat amelyek még szabadok*/
 	return function (req, res, next) {
  		var taskModel =  objectRepository.taskModel;
  		taskModel.find({project : req.query.id},function(err,result) {
    		if(err){
      			logger(2,err);
    			return res.status(500).send({error: "Error"});
			}
    		else{
    			next.tasks = result;
    			return next();
    		}
  		});
 	};
}
