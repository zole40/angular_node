/**A status alapján a megfelelő módon loglja az üzenetet */
module.exports = function () {
	/**color/safe */
	var colors = require('colors/safe');
	/**témák definiálása*/
	colors.setTheme({
  		prompt: 'grey',
  		info: 'green',
  		warn: 'cyan',
  		error: 'red'
	});
	/**status - jelzés összerendelés */
	var messages ={
		1: colors.warn,
		2: colors.error,
		3: colors.info,
		4: colors.prompt
	};
	/**Kiírja az üzenetet a megfelelő szinnel */
	return function (status,message) {
		if(status != undefined){
		console.log(messages[status](message));
		}
	};
};