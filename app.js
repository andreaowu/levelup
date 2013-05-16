/*
* Module dependencies
* http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
* 
*
* socket order:
* client: pressJ oin game, 'join'
* server: gets information on 'join'
* when enough people, give random levels by emit 'level'
*
* Also Q  >K . GR.
* if someone doesn't declare.
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
var socket_name = {}; // socket to name
var id = {}; // socket.id to name
var namesArray = new Array(); // array of names
var freeSeats = 4;
var whereFreeSeats = [0, 1, 2, 3]; // array of where there are free seats
var player_cards = {}; //name to cards
var cards = ["http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngK ",
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/heart_zps4275136d.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/diamond_zps01fb8d3c.pngK ", 
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png 9", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.png10", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngJ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngQ ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/club_zps232bde05.pngK ",
            "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/abigjoker_zps666b2609.png  ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/abigjoker_zps666b2609.png  ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/asmalljoker_zps05417c29.png  ", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/asmalljoker_zps05417c29.png  "];
var deletelater = ["http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png A", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4"];
//var cards = ["http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 2", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 3", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 4", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 5", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 6", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 7", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 8", "http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/spade_zps2465dcec.png 9"];
var drawer = 0;
var declarer = null;
var round = 0; //max is 25
var suit; //first card of round
var number; //first card of round
var broken = 0; //whether trump suit is broken
var tell = false;
var nobody = 0;
var beganAlready = false;
var levelsOfPlayers = new Array(); // array of players' levels in order

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

io.sockets.on('connection', function (socket) {
	socket.on('join', function (name) {
    if (freeSeats  > 0) {
      freeSeats = freeSeats - 1;
      clients[socket.id] = socket;
      names[name] = socket.id;
      socket_name[socket] = name;
      id[socket.id] = name;
      namesArray[whereFreeSeats[0]] = name;
      whereFreeSeats.shift();
      if (namesArray.length == 4) {
        if (!beganAlready) {
          cards = shuffleArray(cards);
          //levels = [2, 3, 4, 5];
          levels = new Array(Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1), Math.ceil(Math.random()*12 + 1));
          levelsOfPlayers = levels;
          io.sockets.emit('level', namesArray, levels);
          for (var i = 0; i < 4; i++) {
            player_cards[namesArray[i]] = [];
            clients[names[namesArray[drawer+i]]].emit('personal level', levels[drawer+i]);
          };
          clients[names[namesArray[drawer]]].emit('start');
          beganAlready = true;
        } else {
          socket.emit('rejoined');
          io.sockets.emit('level', namesArray, levels);
        }
      }
    } else {
      socket.emit('goodbye');
    }
	});

  socket.on('start', function() {
    io.sockets.emit('drawing', namesArray[drawer]);
  });

  socket.on('drew', function() {
    clients[names[namesArray[drawer]]].emit('giveCard', cards[0]);
    player_cards[namesArray[drawer]].push(cards.shift());
    drawer += 1;
    drawer = drawer % 4;
    if (cards.length > 4) { // change number to be the number of cards
      io.sockets.emit('drawing', namesArray[drawer]);
      clients[names[namesArray[drawer]]].emit('start');
    } else {
      if (declarer == null) {
        io.sockets.emit('someoneDeclare');
      }
    }
  });

  socket.on('needStack', function() {
    giveStack();
  });

  socket.on('declare', function(name, suitDec, numberDec) {
    if (numberDec.indexOf("J") != -1) {
      numberDec = "11";
    } else if (numberDec.indexOf("Q") != -1) {
      numberDec = "12";
    } else if (numberDec.indexOf("K") != -1) {
      numberDec = "13";
    }
    console.log(numberDec);
    var dec = false;
    for (var i = 0; i < 4; i++) {
      if (name == namesArray[i] && numberDec == levelsOfPlayers[i]) {
        if (declarer == null) {
          dec = true;
          io.sockets.emit('declarationHappened', name, suitDec, numberDec);
          suit = suitDec;
          number = numberDec;
          declarer = name;
          console.log(declarer);
          if (cards.length == 4) {
              giveStack();
          }
          break;
        }
      }
    }
    if (!dec) {
        console.log("cannot");
        socket.emit('cannotDeclare');  
      }
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

  socket.on('disconnect', function() {
    var person = id[socket.id];
    freeSeats = freeSeats + 1;
    for (var i = 0; i < namesArray.length; i++) {
      if (namesArray[i] == person) {
        namesArray[i] = "";
        whereFreeSeats.push(i);
        delete clients[socket.id];
        delete names[person];
        delete socket_name[socket];
        delete id[socket.id];
        player_cards[""] = player_cards[namesArray[i]];
        break;
      }
    }
    io.sockets.emit('announceLeave', person);
  });
});

function giveStack () {
  console.log("give stack");
  if (!tell) { // whether the person got the stack yet
    console.log("tell");
    io.sockets.emit('who stacking', declarer);
    tell = true;
    clients[names[declarer]].emit('stack', deletelater);
    cards = [];
  }
}

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
