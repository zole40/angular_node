 /**Megváltoztatja az adott felhasztnálóhoz tartozó feladatok színét a kiívánt színre */
 module.exports = function(objectRepository,logger){
    return function (userName,color) {
        var taskModel =  objectRepository.taskModel;
        taskModel.find({user : userName}, function (err, result) {
            for(a in result){
                result[a].color = color;
                result[a].save(function(err){
                    if (err) {
	    		        logger(2,err);            
  	    		    }
                    else{
                        logger(4,"Task(" + result[a].id + ") updated" + result[a].color);
                    }
                });
            }
        });
    };
 }
