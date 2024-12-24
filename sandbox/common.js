const { runInThisContext } = require('vm');
const path = require('path');

const code = `
  const express = require('express');
  const rateLimit = require('express-rate-limit');
  const cors = require('cors');
  const bodyParser = require('body-parser');

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  const whitelist = ['192.168.0.1', '10.0.0.1'];

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 4,
    message: 'Too many requests, please try again later.',
  });

  const whitelistIP = (req, res, next) => {
    const clientIP = req.ip;

    if (!whitelist.includes(clientIP)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };

  app.get('/', whitelistIP, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.post('/login', limiter, whitelistIP, (req, res) => {
    const { username, password } = req.body;

    const users = [
      { username: 'user1', password: 'password1', authToken: 'token1' },
      { username: 'user2', password: 'password2', authToken: 'token2' },
    ];

    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({ token: user.authToken });
  });

  app.get('/protected', limiter, whitelistIP, (req, res) => {
    res.json({ message: 'Protected data' });
  });

  app.get('/additional', limiter, whitelistIP, (req, res) => {
    res.json({ message: 'Additional data' });
  });

  app.listen(8080, () => {
    console.log('Server listening on port 8080');
  });
`;

runInThisContext(code);
