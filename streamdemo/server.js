const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const server = http.createServer((req, res) => {
	if (req.url === '/') {
		fs.readFile('./index.html', 'utf8', (err, data) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'text/plain');
				res.end('Internal Server Error');
				console.error(err);
				return;
			}

			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			res.end(data);
		});
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end('Not Found');
	}
});

const io = socketio(server);

io.on('connection', (socket) => {
	console.log('a user connected');

	// Send data every second
	const interval = setInterval(() => {
		const data = Math.random();
		console.log(`sending data: ${data}`);
		socket.emit('data', data);
	}, 1000);

	socket.on('disconnect', () => {
		console.log('user disconnected');
		clearInterval(interval);
	});
});

server.listen(3000, () => {
	console.log('Server running on port 3000');
});
