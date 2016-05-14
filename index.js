var express = require('express');
var app = express();
var http = require('http').Server(app);
var session = require('express-session');
var cookieParser = require('cookie-parser');
var colors = require('colors');
var log = require('./middleware/generic/log');
var logger = require('./middleware/generic/logger');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser());
app.use( bodyParser.json() );
app.use(cookieParser());
app.use(session({
  secret: "none",
  user: {
    name : "anonim"
  },
  cookie: {
    maxAge: 600000
  },
  resave: true,
  saveUninitialized: false,

}));
app.use(log(logger()));
require('./routes/out')(app);
require('./routes/task')(app,logger());
require('./routes/user')(app,logger());
require('./routes/project')(app,logger());
require('./routes/chat')(io);
app.use(express.static(__dirname));



app.set('view engine', 'ejs');

app.use(function (err, req, res, next) {
  console.log(colors.red(err));
  res.status(500).send();

  //Flush out the stack to the console
  console.error(err.stack);
});

http.listen(3000, function(){
  console.log(colors.green('listening on *:3000'));
});