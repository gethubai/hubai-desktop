import express, { Express } from 'express';
import { createServer } from 'http';
import { ServerPort } from 'api-server/consts';
import { loadLocalBrains } from 'api-server/brain/brainLoader';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
// import { setupSocketIoServer } from './socketIo';
import { setupMqttAedesServer } from './mqttAedes';

export const setupApp = async (): Promise<Express> => {
  try {
    const app = express();
    setupMiddlewares(app);
    setupRoutes(app);
    const httpServer = createServer(app);
    setupMqttAedesServer(httpServer);

    httpServer.listen(ServerPort, async () => {
      console.log(`API server listening on port ${ServerPort}`);

      await loadLocalBrains();
    });
    return app;
  } catch (err) {
    console.log('Could not setup app', err);
    throw err;
  }
};
