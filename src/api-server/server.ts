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
import makeLoadLocalBrains from './brain/factories/usecases/loadLocalBrainsFactory';
import { getSupportedPromptTypesFromCapabilities } from './brain/brainSettings';
import brainServerManager from './brain/brainServerManager';

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

  // TODO: Create a brainLoader class to load brains from the file system and do this logic there
  const getBrainsUseCase = await makeLoadLocalBrains();
  const brains = await getBrainsUseCase.getBrains();

  for (const brain of brains) {
    // TODO: CHANGE THE PATH!
    const brainService = await import(
      `/Users/macbook/brains/builds/${brain.name}/main.js`
    );

    const settings = {
      id: brain.id,
      name: brain.name,
      nameAlias: brain.title,
      supportedPromptTypes: getSupportedPromptTypesFromCapabilities(
        brain.capabilities
      ),
    };

    const brainServer: IBrainServer = new TcpBrainServer(
      brainService.default,
      settings
    );

    brainServerManager.addClient(brainServer);
  }
});
