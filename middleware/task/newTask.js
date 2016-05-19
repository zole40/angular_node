 /**Létrehoz egy új taskot a megadott projecthez */
 module.exports = function(objectRepository,logger){
    return function (req, res, next) {
        /**Megvizsgálja, hogy a project tulajdonosa-e a felhasználó */
        if(next.owner){
            /**Ha igen akkor megróbálja a létrehozni a feladatot */
            var taskModel =  objectRepository.taskModel;
            var newTask = new taskModel({
                title: req.body.title,
	            description: req.body.description,
	            project: req.query.id,
                start: req.body.start,
                user: "",
                finished: req.body.finished
             });
             newTask.save(function (err,result) {
	    	    /** Hiba esetén logolja 2-es status kóddal majd http 500-as küld vissza */
  	    		if (err) {
	    		    logger(2,err);
                    return res.status(500).send({error: "Error"});
  	    		}
               /**Ha sikerült hozzáadni az adatbázishoz akkor logolja 4-es status kóddal és http 201-et küld vissza */ 
                else {
		    	    logger(4,req.body.title + " created in project("+req.query.id+")");	
                    return res.status(201).send({task : result});
  			    }
            });
        }
        /**Ha nem akkor logolja 1-es status kóddal és http 401-es küld vissza */
        else{
            logger(1,req.session.user.name + " acces denied to project(" +req.query.id +")");
            return res.status(401).send({error: 'Hozzáférés megtagadva!'});
        }
    };
}