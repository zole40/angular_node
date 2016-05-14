 module.exports = function(){
  /* Lekérdezni a kívánt projekthez tartozó feladatokat és visszadja azokat amelyek már elvállata valaki*/
 	return function (req, res, next) {
 	var projects = [
      {title: 'projekt 1',id : "0"},
      {title: 'projekt 2',id : "1"},
      {title: 'projekt 3',id : "2"}
    ];
    res.json({ 'projects': projects })
 }
}