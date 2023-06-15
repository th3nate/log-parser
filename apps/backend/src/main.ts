/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { logger, mongooseLogger } from './app/log-parser';
import * as mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: { target: false },
      transformOptions: {
        exposeUnsetFields: false,
      },
    })
  );
  app.enableCors();
  app.use(logger);

  mongoose.set('debug', mongooseLogger);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
