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
var cards = ["http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png K",
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zpsb6b976b9.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps38048c5a.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zpsfdc31ca3.png K", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 1", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png J", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png Q", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps4cacfedf.png K",
            "bigJoker  ", "bigJoker  ", "smallJoker  ", "smallJoker  "];
var drawer = 0;
var player_cards = {}; //name to cards

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
      for (var i = 0; i < 4; i++) {
        player_cards[namesArray[i]] = [];
      };
      io.sockets.emit('level', namesArray, new Array(Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1), Math.floor(Math.random()*15 + 1)));
      clients[names[namesArray[drawer]]].emit('start');
    };
	});

  socket.on('start', function() {
    io.sockets.emit('drawing', namesArray[drawer]);
  });

  socket.on('drew', function() {
    if (cards.length > 0) {
      clients[names[namesArray[drawer]]].emit('giveCard', cards[0]);
      player_cards[namesArray[drawer]].push(cards.shift());
      drawer += 1;
      drawer = drawer % 4;
      io.sockets.emit('drawing', namesArray[drawer]);
      clients[names[namesArray[drawer]]].emit('start');
    } else {
      io.sockets.emit('startGame');
    }
  });

  socket.on('declare', function(name, suit, number) {
    io.sockets.emit('declarationHappened', name, suit, number);
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