const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configure CORS
app.use(cors());

// Configure body-parser middleware
app.use(bodyParser.json());

// Rate limiting for protected and additional routes
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4, // Maximum 4 requests per minute
  message: 'Too many requests, please try again later.',
});

// Simulated user database
const users = [
  { username: 'user1', password: 'password1', authToken: 'token1' },
  { username: 'user2', password: 'password2', authToken: 'token2' },
];

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find((u) => u.authToken === authToken);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};

// Login route
app.post('/login', limiter, (req, res) => {
  const { username, password } = req.body;

  // Perform authentication
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({ token: user.authToken });
});

// Protected route with rate limiting and authentication
app.get('/protected', authenticateUser, limiter, (req, res) => {
  // Handle protected route logic
  res.json({ message: 'Protected data' });
});

// Additional route with rate limiting and authentication
app.get('/additional', authenticateUser, limiter, (req, res) => {
  // Handle additional route logic
  res.json({ message: 'Additional data' });
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
