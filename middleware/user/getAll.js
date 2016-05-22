module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		var userModel = objectRepository.userModel;
  		/**Megvizsgálja, hogy létezik-e a kívánt felhasználó */
		userModel.find({}, function (err, result){
            
        });
    }
}