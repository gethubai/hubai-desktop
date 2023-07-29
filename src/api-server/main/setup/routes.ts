import { Express, Router } from 'express';
import chatRoutes from '../routes/chatRoutes';

const routes = [chatRoutes];

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  routes.map(async (r) => r(router));
};
