 module.exports = function(objectRepository){
 	return function (req, res, next) {
/*
Megnézi, hogy a belépési adatok megfelelőek és ha igen akkor
belépteti majd továbbítja a főoldalra, ha nem akkor  hiaüzenetet küld, hogy nem megfelelőek az adatok.
*/
	var userModel = objectRepository.userModel;
	var user = find(userModel,req.body.name)
	console.log(user);
 	if (user){
        return res.status(400).send({error: 'Felhaszáló már létezik'});
    }
    else{
    	user = {
    		name: req.body.name,
    		password: req.body.password,
    		email: req.body.email,
    		address: req.body.address,
    		id: req.body.name
    	};
    	userModel.push(user);
    }
     req.session.id = user.id;
     return res.sendStatus(200);

 };
 function find(userModel,name){
 	for(a in userModel){
 		if(userModel[a].name == name){
 			return userModel[a];
 		}
 		else{
 			return false;
 		}
 		}
 	};
};