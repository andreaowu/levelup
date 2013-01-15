/*
* Module dependencies
* http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
* 
*
* socket order:
* client: press join game, 'join'
* server: gets information on 'join'
* when enough people, give random levels by emit 'level'
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
var socket_name = {} //socket to name
var namesArray = new Array();
var cards = ["http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png K",
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png K",
            "bigJoker  ", "bigJoker  ", "smallJoker  ", "smallJoker  "];
var drawer = 0;
var player_cards = {}; //name to cards
var declarer;
var round = 0; //max is 25
var suit;
var number;
var broken = 0;

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
    socket_name[socket] = name;
    namesArray.push(name);
    if (namesArray.length > 4) {
      socket.emit('goodbye');
    }
    if (namesArray.length == 4) {
      cards = shuffleArray(cards);
      levels = new Array(Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1));
      io.sockets.emit('level', namesArray, levels);
      for (var i = 0; i < 4; i++) {
        player_cards[namesArray[i]] = [];
        clients[names[namesArray[drawer+i]]].emit('personal level', levels[drawer+i]);
      };
      clients[names[namesArray[drawer]]].emit('start');
    };
	});

  socket.on('start', function() {
    io.sockets.emit('drawing', namesArray[drawer]);
  });

  socket.on('drew', function() {
    if (cards.length > 4) {
      clients[names[namesArray[drawer]]].emit('giveCard', cards[0]);
      player_cards[namesArray[drawer]].push(cards.shift());
      drawer += 1;
      drawer = drawer % 4;
      io.sockets.emit('drawing', namesArray[drawer]);
      clients[names[namesArray[drawer]]].emit('start');
    } else {
      io.sockets.emit('who stacking', declarer);
      clients[names[declarer]].emit('stack', cards)
      cards = [];
    }
  });

  socket.on('declare', function(name, suitDec, numberDec) {
    io.sockets.emit('declarationHappened', name, suitDec, numberDec);
    suit = suitDec;
    number = numberDec;
    declarer = name;
    drawer = namesArray.index(name);
  });

  socket.on('stacked', function(card) {
    cards.push(card);
  });

  socket.on('done stacking', function(partner) {
    io.sockets.emit('partner', partner, declarer);
    if (round < 26) {
      io.sockets.emit('who taking turn', namesArray[drawer]);
      clients[names[namesArray[drawer]]].emit('play', broken);
    }
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
