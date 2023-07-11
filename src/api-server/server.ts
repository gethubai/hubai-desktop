/* eslint-disable no-await-in-loop */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import brainRoutes from './brain/routes';
import chatServer from './chat/chatTcpServer/server';
import { ChatServerConfigs, ServerPort } from './consts';
import { loadLocalBrains } from './brain/brainLoader';

const bodyParser = require('body-parser');

const app = express();

export const startServer = async () => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:1212',
    },
  });

  const chatNamespace = io.of(ChatServerConfigs.mainNamespace);

  chatServer.startServer(chatNamespace);

  app.use(bodyParser.json());
  app.use('/api/brain', brainRoutes);

  app.get('/', (req, res) => {
    res.send('HubAI server is running!');
  });

  httpServer.listen(ServerPort, async () => {
    console.log(`API server listening on port ${ServerPort}`);
    // Load brains when server is ready
    await loadLocalBrains();
  });
};
