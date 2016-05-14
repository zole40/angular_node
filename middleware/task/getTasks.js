 module.exports = function(objectRepository){
  /* Lekérdezni a kívánt projekthez tartozó feladatokat és visszadja azokat amelyek már elvállata valaki*/
 	return function (req, res, next) {
        var result = [];
     for(i in next.tasks){
       if(next.tasks[i].user !== ""){
         result.push(next.tasks[i]);
       }
     }
    res.json({ 'events': result });
 };
}
