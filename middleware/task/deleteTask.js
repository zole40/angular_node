 /**Létrehoz egy új taskot a megadott projecthez */
 module.exports = function(objectRepository,logger){
    return function (req, res, next) {
        /**Megvizsgálja, hogy a project tulajdonosa-e a felhasználó */
        if(next.owner){
            /**Ha igen akkor megróbálja a létrehozni a feladatot */
            var taskModel =  objectRepository.taskModel;
            taskModel.findById(req.body.id,function (err,result) {
            	/**Hiba esetén logolja 2-es status kóddal majd hhtp 500-at küld vissza */
        		if(err){
					logger(2,err);
					return res.status(500).send({error :"Error"});
        		}
        		/**Ha nem létezik  a kívánt project akkor logolja 1-es status kóddal és http 404 küld vissza */
        		else if ((!result)) {
					logger(1,"A project (" + req.query.id + ') nem létezik');
          			return res.status(404).send({error: 'A project nem létezik'});
        		}  
            	result.remove(function (err) {
	    	    	/** Hiba esetén logolja 2-es status kóddal majd http 500-as küld vissza */
  	    			if (err) {
	    		    	logger(2,err);
                    	return res.status(500).send({error: "Error"});
  	    			}
               /**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és http 201-et küld vissza */ 
                	else {
		    	    	logger(4,"Task (" + req.body.id + ") deleted");	
                    	return res.status(201).send(req.body.id + "delete");
  			    	}
            	});
			});
        }
        /**Ha nem akkor logolja 1-es status kóddal és http 401-es küld vissza */
        else{
            logger(1,req.session.user.name + " acces denied to project(" +req.query.id +")");
            return res.status(401).send({error: 'Hozzáférés megtagadva!'});
        }
    };
}