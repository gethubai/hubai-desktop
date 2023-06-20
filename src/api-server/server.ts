/* eslint-disable no-await-in-loop */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import brainRoutes from './brain/routes';
import chatServer from './chat/chatServer';
import { IBrainServer } from './brain/brainServer';
import TcpBrainServer from './brain/tcpBrainServer';

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

const brainsServers: IBrainServer[] = [];
httpServer.listen(port, async () => {
  console.log(`API server listening on port ${port}`);

  const brains = ['openai-brain', 'fake-brain', 'chatgpt-brain'];

  for (const brain of brains) {
    const brainService = await import(
      `/Users/macbook/brains/${brain}/build/src/main.js`
    );
    const brainServer: IBrainServer = new TcpBrainServer(brainService.default);
    brainServer.start('http://localhost:4114');
    brainsServers.push(brainServer);

    console.log(`Brain ${brain} has been loaded`);
  }
});
