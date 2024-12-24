// Import dependencies
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

// Initialize express app and create a server instance
const app = express();
const server = http.createServer(app);

// Create a new socket.io instance and listen for connections
const io = socketio(server);

// Handle incoming connections from clients
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Send a welcome message to the client
  socket.emit('message', 'Welcome to the chat room!');

  // Handle incoming chat messages from the client
  socket.on('message', (message) => {
    console.log(`New message from client: ${message}`);

    // Broadcast the message to all connected clients
    io.emit('message', message);
  });

  // Handle client disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Serve static files from the public directory
app.use(express.static('public'));

// Start the server and listen for incoming requests
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
