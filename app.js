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
var clients = {}; //socket.id to socket
var names = {};   // name to socket.id
var namesArray = [];
var cards = ["spades 1", "spades 2", "spades 3", "spades 4", "spades 5", "spades 6", "spades 7", "spades 8", "spades 9", "spades10", "spades J", "spades Q", "spades K", 
            "hearts 1", "hearts 2", "hearts 3", "hearts 4", "hearts 5", "hearts 6", "hearts 7", "hearts 8", "hearts 9", "hearts10", "hearts J", "hearts Q", "hearts K", 
            "diamonds 1", "diamonds 2", "diamonds 3", "diamonds 4", "diamonds 5", "diamonds 6", "diamonds 7", "diamonds 8", "diamonds 9", "diamonds10", "diamonds J", "diamonds Q", "diamonds K", 
            "clubs 1", "clubs 2", "clubs 3", "clubs 4", "clubs 5", "clubs 6", "clubs 7", "clubs 8", "clubs 9", "clubs10", "clubs J", "clubs Q", "clubs K",
            "spades 1", "spades 2", "spades 3", "spades 4", "spades 5", "spades 6", "spades 7", "spades 8", "spades 9", "spades10", "spades J", "spades Q", "spades K", 
            "hearts 1", "hearts 2", "hearts 3", "hearts 4", "hearts 5", "hearts 6", "hearts 7", "hearts 8", "hearts 9", "hearts10", "hearts J", "hearts Q", "hearts K", 
            "diamonds 1", "diamonds 2", "diamonds 3", "diamonds 4", "diamonds 5", "diamonds 6", "diamonds 7", "diamonds 8", "diamonds 9", "diamonds10", "diamonds J", "diamonds Q", "diamonds K", 
            "clubs 1", "clubs 2", "clubs 3", "clubs 4", "clubs 5", "clubs 6", "clubs 7", "clubs 8", "clubs 9", "clubs10", "clubs J", "clubs Q", "clubs K",
            "bigJoker  ", "bigJoker  ", "smallJoker  ", "smallJoker  "];

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

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
};

io.sockets.on('connection', function (socket) {
  clients[socket.id] = socket;

	socket.on('join', function (name) {
    names[name] = socket.id;
    namesArray.push(name);
    if (namesArray.length > 4) {
      socket.emit('goodbye');
    } else {
      socket.emit('alert', namesArray);
    }
    if (namesArray.length == 4) {
      cards = shuffleArray(cards);
      for (var i = 0; i < 4; i++) {
        io.sockets.emit('level', namesArray, new Array(Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1)));
      };
      io.sockets.emit('start');
    };
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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}