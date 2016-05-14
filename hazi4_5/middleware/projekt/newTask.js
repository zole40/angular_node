 module.exports = function(objectRepository){
  /* Lekérdezni a kívánt projekthez tartozó feladatokat és visszadja azokat amelyek már elvállata valaki*/
 	return function (req, res, next) {
 	console.log(req.body);
    return res.status(200).send();
 }
}