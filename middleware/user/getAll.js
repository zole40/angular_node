/**Összed felhasználó lekérése */
module.exports = function(objectRepository,logger){
	return function (req, res, next) {
		var userModel = objectRepository.userModel;
		userModel.find({}, function (err, result){
       	if(err){
			logger(2,err);
			return res.status(500).send({error :"Error"});
        }
		return res.json({users : result});	
        });
    }
}