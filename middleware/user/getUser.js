 /**Vissza adja a sessionben tárolt usert */
 module.exports = function(){
 	return function (req, res, next) {
         return res.json({user : req.session.user});
	/**function vége */
	};
/**module vége */
};
