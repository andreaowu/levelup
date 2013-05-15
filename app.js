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

var express = require('express')
, stylus = require('stylus')
, nib = require('nib')
, http = require('http')
, util = require('./util');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var clients = {}; //socket.id to socket
var names = {};   // name to socket.id
var socket_name = {}; //socket to name
var namesArray = new Array();
var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['C', 'D', 'H', 'S'];
var suit_to_image = {'C': 'club_zps232bde05', 'D': 'diamond_zps01fb8d3c', 'H': 'heart_zps4275136d', 'S': 'spade_zps2465dcec'};

var to_url = function (x) {
  return 'http://i54.photobucket.com/albums/g98/andreaowu/Website%20Dev/Levelup/' + x + '.png';
};

var jokers = [[to_url('abigjoker_zps666b2609'), ''], [to_url('asmalljoker_zps05417c29'), '']];

var suit_urls = suits.map(function (x) {
  return to_url(suit_to_image[x]);
});

var deck = util.product(suit_urls, ranks).concat(jokers);

deck = deck.map(function (x) {
  return x.join(' ');
});

var cards = deck.concat(deck);

var drawer = 0;
var player_cards = {}; //name to cards
var declarer = null;
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

io.configure('log level', '1');

var port = process.env.PORT || 3000;
server.listen(port);

function startRound() {
  cards = shuffleArray(cards);
  var levels = [0,0,0,0].map(function () {return util.randInt(13);});
  io.sockets.emit('level', namesArray, levels);
  for (var i = 0; i < 4; i++) {
    player_cards[namesArray[i]] = [];
    clients[names[namesArray[drawer+i]]].emit('personal level', levels[drawer+i]);
  }
  clients[names[namesArray[drawer]]].emit('start');
}

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
      startRound();
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
    if (cards.length > 4) {
      io.sockets.emit('drawing', namesArray[drawer]);
      clients[names[namesArray[drawer]]].emit('start');
    } else {
      if (declarer === null) {
        io.sockets.emit('someone declare!');
      } else {
        io.sockets.emit('who stacking', declarer);
        clients[names[declarer]].emit('stack', cards);
        cards = [];
      }
    }
  });

  socket.on('declare', function(name, suitDec, numberDec) {
    io.sockets.emit('declarationHappened', name, suitDec, numberDec);
    suit = suitDec;
    number = numberDec;
    declarer = name;
    drawer = namesArray.indexOf(name);
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

app.get('/', function (req, res) { // HTTP GET method with path /, 'root' page
  res.render('index',
	     { title : 'Home' }
	    );
});

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
