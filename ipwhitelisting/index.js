const express = require('express');
const app = express();

// Define the whitelist of allowed IP addresses
const whitelist = ['192.168.0.1', '10.0.0.1', '127.0.0.1', '::1'];

// Middleware function to check if the IP is whitelisted
const whitelistMiddleware = (req, res, next) => {
  const clientIP = req.ip;console.log(req.ip)

  if (whitelist.includes(clientIP)) {
    next(); // Proceed to the next middleware/route handler
  } else {
    res.status(403).send('Forbidden');
  }
};

// Apply the whitelist middleware to all routes
app.use(whitelistMiddleware);

// Route handler
app.get('/', (req, res) => {
  res.send('Welcome to the whitelisted area!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
