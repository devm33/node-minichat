var server = require('http').createServer();
var wss = new require('ws').Server({server: server});
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

// Serve files from the static directory.
app.use('/', express.static(__dirname + '/static'));

// Send and receive chat message with the websocket server
wss.on('connection', function(ws) {
  // Listen for messages sent from the frontend clients.
  ws.on('message', function(msg) {
    // When a message is received broadcast it out to each connected client.
    wss.clients.forEach(function(client) {
      client.send(msg);
    });
  });
});

// Start up the web server.
server.on('request', app);
server.listen(port, function() {
  console.log('Node app is running on port', port);
});
