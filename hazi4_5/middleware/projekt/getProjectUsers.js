 module.exports = function(){
  /* Lekérdezni a kívánt projekthez tartozó feladatokat és visszadja azokat amelyek már elvállata valaki*/
 	return function (req, res, next) {
 	var users = [
      {name: 'Bela',id : "0"},
      {name: 'János',id : "1"},
      {name: 'Éva',id : "2"}
    ];
    res.json({ 'users': users })
 }
}