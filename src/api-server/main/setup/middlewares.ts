import { Express, json, Request, Response, NextFunction } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*');
  res.set('access-control-allow-headers', '*');
  res.set('access-control-allow-methods', '*');
  next();
};

export const contentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.type('json');
  next();
};

export default (app: Express): void => {
  app.use(json());
  app.use(cors);
  app.use(contentType);
};
