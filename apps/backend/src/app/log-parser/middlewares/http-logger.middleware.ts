import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

export function logger(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('HTTP');
  logger.log(`${req.method} ${req.originalUrl}`);
  next();
}
