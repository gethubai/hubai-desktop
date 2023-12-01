import { Request, Response } from 'express';
import { Controller } from '../protocols/controller';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const jsonData = req.body?.jsonData ? JSON.parse(req.body.jsonData) : {};
    const request = {
      ...(req.body || {}),
      ...jsonData,
      ...(req.params || {}),
      ...(req.query || {}),
      file: req.file,
      files: req.files,
      context: { userId: req.headers['user-id'] },
    };
    try {
      const httpResponse = await controller.handle(request);

      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
      } else {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body.message,
        });
      }
    } catch (error: any) {
      console.error('Request error: ', error);
      res.status(500).json({
        error: error?.message,
      });
    }
  };
};
