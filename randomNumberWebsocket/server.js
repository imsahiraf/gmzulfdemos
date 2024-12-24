const express = require('express');
const WebSocket = require('ws');

// Create an Express app
const app = express();

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Create a WebSocket server
const server = app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

// Create a WebSocket instance
const wss = new WebSocket.Server({ server });

// Generate a random number and send it to all connected clients every second
setInterval(() => {
  const randomNumber = Math.floor(Math.random() * 100);
  console.log(randomNumber)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(randomNumber.toString());
    }
  });
}, 1000);
