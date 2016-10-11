# Node Minichat

Minimal chat example using Node.js on Heroku.

Deployed here <https://node-minichat.herokuapp.com/>

### 1. Write Node.js backend application

The applications `node` and `npm` will be needed. Install them from here
<https://nodejs.org/en/download/>

Then add a `package.json` file to your project by running:

    npm init --yes

Install the neccessary dependencies and add then to the `package.json` by
running:

    npm install --save express@4.13
    npm install --save ws@1.1

- [Express](https://expressjs.com/) is a web framework for Node
- [ws](https://github.com/websockets/ws) is a websocket library.

Create an `index.js` file. This is the main node application file for the
backend. First thing to do in `index.js` is import our libraries:

```js
var server = require('http').createServer();
var wss = new require('ws').Server({server: server});
var express = require('express');
var app = express();
```

Add a variable to configure the port we will use. Note: `process.env.PORT` is
something that Heroku will use later on, by default this will use the port 8080.

```js
var port = process.env.PORT || 8080;
```

We need to configure the express webframework to serve the static html and js
frontend application.

```js
// Serve files from the static directory.
app.use('/', express.static(__dirname + '/static'));
```

Now we need to configure the websocket connection where we will send and receive
chat messages.

```js
wss.on('connection', function(ws) {
  // Listen for messages sent from the frontend clients.
  ws.on('message', function(msg) {
    // When a message is received broadcast it out to each connected client.
    wss.clients.forEach(function(client) {
      client.send(msg);
    });
  });
});
```

Finally, start the http web server.

```js
// Start up the web server.
server.on('request', app);
server.listen(port, function() {
  console.log('Node app is running on port', port);
});
```

### 2. Write HTML/JS frontend application

Create a folder named `static`. Inside `static` create `index.html` with three
things:

- a div to display messages in
- a form to submit messages from
- a script to include `main.js`

```html
<!DOCTYPE html>
<div id="messages"></div>
<form id="message-form">
  <input type="text" id="message">
  <button type="submit">Send</button>
</form>
<script src="/main.js"></script>
```

Now we need to write the frontend application in `main.js`. Create `main.js`
also inside the `static` folder. First thing to do is create a `Chat` class. On
initialization this class will bind to the html elements from `index.html` and
open a connection to the backend.

```js
// Initializes Chat
function Chat() {
  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

  // Focus on the input
  this.messageInput.focus();

  // Open websocket connection.
  this.ws = new WebSocket(location.origin.replace(/^http/, 'ws'));
  this.ws.onmessage = this.displayMessage.bind(this);
}

window.onload = function() {
  new Chat();
};
```

Now there are two functions referenced in the initialization code that need to
be defined `saveMessage` and `displayMessage`. Let's start with displaying a
message.

```js
// Displays a Message in the UI.
Chat.prototype.displayMessage = function(message) {
  var msg = document.createElement('div');
  msg.innerHTML = message.data;
  this.messageList.appendChild(msg);
};
```

Finally, we will use the `Chat` class's `this.ws` websocket connection to send a
message to the backend when the user submits a message to the messageForm.

```js
// Sends user's message to the backend
Chat.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message.
  if (this.messageInput.value) {
    // Send message to backend
    this.ws.send(this.messageInput.value);
    // Clear message text field and focus on it.
    this.messageInput.value = '';
    this.messageInput.focus();
  }
};
```

### 3. Test locally

In a new terminal run:

    node index.js

Check it out at <http://localhost:8080/>

Press `control+c` to stop running the web server locally.

### 4. Deploy to Heroku

Sign up for a Heroku account here <https://signup.heroku.com/signup/dc> you will
need an email address.

Then downloand and install the Heroku CLI from here
<https://devcenter.heroku.com/articles/heroku-command-line#download-and-install>
and login

    heroku login

To create a new Heroku project run:

    heroku create

In order for Heroku to know how to run the backend create a file named
`Procfile` with the contents:

    web: node index.js

Deploy your code:

    git push heroku master

Ensure that at least one instance of the app is running:

    heroku ps:scale web=1

Finally this command will open your application in a browser:

    heroku open
