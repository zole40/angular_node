var express = require('express');
var app = express();
var http = require('http').Server(app);
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  },
  resave: true,
  saveUninitialized: false
}));

require('./routes/out')(app);
require('./routes/task')(app);
require('./routes/user')(app);
require('./routes/project')(app);
app.use(express.static(__dirname));



app.set('view engine', 'ejs');

app.use(function (err, req, res, next) {
  res.status(500).send('Houston, we have a problem!');

  //Flush out the stack to the console
  console.error(err.stack);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});