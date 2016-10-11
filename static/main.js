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

// Displays a Message in the UI.
Chat.prototype.displayMessage = function(message) {
  var msg = document.createElement('div');
  msg.innerHTML = message.data;
  this.messageList.appendChild(msg);
};

window.onload = function() {
  new Chat();
};
