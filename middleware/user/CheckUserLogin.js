/**Megvizsgálj,a hogy a felhasználó be van-e jelentkezve */
module.exports = function (objectrepository) {
 	return function (req, res, next) {
    	/**Megvizsgálj hogy van-e session.secret */
		if (typeof req.session.secret === "undefined") {
		/**Ha nincs akkor átirányír a kezdőoldalra */
      	return res.redirect('/');
    	} else {
		/**Ha van akkor tovább adja a vezérlést a következő middleware-nek */
      	return next();
    	}
	/**function vége */
  	};
/**module vége */
};