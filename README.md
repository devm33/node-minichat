# Node Minichat

Minimal chat example using Node.js on Heroku.

Deployed here <https://node-minichat.herokuapp.com/>

### 1. Write Node.js backend application

The applications `node` and `npm` will be needed. Install them from here <https://nodejs.org/en/download/>

Then add a `package.json` file to your project by running:

    npm init --yes

Install the neccessary dependencies and add then to the `package.json` by running:

    npm install --save express@4.13
    npm install --save ejs@2.4
    npm install --save ws@1.1

- [Express](https://expressjs.com/) is a web framework for Node
- [EJS](http://www.embeddedjs.com/) is a templating library.
- [ws](https://github.com/websockets/ws) is a websocket library.

Create an `index.js` file. This is the main node application file for the backend.

First thing to do is import our libraries:

```js
var server = require('http').createServer();
var wss = new require('ws').Server({server: server});
var app = require('express')();
```

Add a variable to configure the port we will use. Note: `process.env.PORT` is something that Heroku will use later on, by default this will use the port 8080.

```js
var port = process.env.PORT || 8080;
```

We need to configure the express webframework to serve our html and js frontend application.

```js
// Serve files from the static directory.
app.use(express.static(__dirname + '/static'));

// Render templates using the EJS library.
app.set('views', __dirname);
app.set('view engine', 'ejs');

// Render index.ejs for the main page.
app.get('/', function(request, response) {
  response.render('index');
});
```

Now we need to configure the websocket connection where we will send and receive chat messages.

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

### 3. Test locally

In a new terminal run:

    node index.js

Press `control+c` to stop running the web server locally.

### 4. Deploy to Heroku

Sign up for a Heroku account here <https://signup.heroku.com/signup/dc> you will need an email address.

Then downloand and install the Heroku CLI from here <https://devcenter.heroku.com/articles/heroku-command-line#download-and-install> and login

    heroku login

To create a new Heroku project run:

    heroku create

In order for Heroku to know the app backend is Node.js create a file named `Procfile` with the contents:

    web: node index.js

Deploy your code:

    git push heroku master

Ensure that at least one instance of the app is running:

    heroku ps:scale web=1

Finally this command will open your application in a browser:

    heroku open
