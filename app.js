/*
* Module dependencies
* http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
*/

var express = require("express")
, stylus = require("stylus")
, nib = require("nib")
, http = require('http')

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var clients = {};
var names = {};
var namesArray = [];

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(stylus.middleware(
    { src: __dirname + '/public'
    , compile: compile
    }
  ));
  app.use(express.static(__dirname + '/public'));
});

var port = process.env.PORT || 3000;
server.listen(port);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  clients[socket.id] = socket;
  if (namesArray.length == 4) {
    console.log("goodbye");
    socket.emit('disconnect');
  };

	socket.on('increment', function (name) {
		counter += 1;
		console.log(counter);
    names[name] = socket.id;
    namesArray.push(name);
		socket.emit('alert', namesArray);
	});
});

var counter = 0;
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.get('/', function (req, res) { // HTTP GET method with path /, "root" page
  res.render('index',
  { title : 'Home' }
  );
})