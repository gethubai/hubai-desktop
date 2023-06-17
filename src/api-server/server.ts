import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import brainRoutes from './brain/routes';
import chatServer from './chat/chatServer';

const bodyParser = require('body-parser');

const port = 4114;

// Create the express application
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:1212',
  },
});

// brainServer.startServer(io);

chatServer.startServer(io);

app.use(bodyParser.json());
app.use('/api/brain', brainRoutes);

app.get('/', (req, res) => {
  res.send('AllAi server is running!');
});

httpServer.listen(port, async () => {
  console.log(`API server listening on port ${port}`);
});
