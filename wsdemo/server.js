// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 9100;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
        console.log('Received message:', message);
    });

    // Example of sending cricket data every 5 seconds
    const matchKey = '12345'; // Replace with your match key
    setInterval(() => {
        const cricketData = {
            overs: {
                WI_W: {
                    1: { overNumber: 1, runs: 6, six: 1, four: 0, boundaries: 1, odd: 2 }
                }
            },
            highestOpeningPartnership: {
                WI_W: { players: ['Player1', 'Player2'], runs: 100 }
            },
            partnership: {
                WI_W: { players: ['Player3', 'Player4'], runs: 50 }
            },
            bowling: {
                WI_W: [{ name: 'Bowler1', overs: 5, runs: 20, wickets: 2 }]
            },
            batting: {
                WI_W: [{ name: 'Batter1', runs: 30, balls: 20, fours: 4, sixes: 1 }]
            }
        };
        ws.send(JSON.stringify({ type: 'cricketData', match_key: matchKey, data: cricketData }));
    }, 5000);

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
});
