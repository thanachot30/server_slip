import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  
  const corsConfig: CorsOptions = {
    origin: true,
    credentials: true,
  };
  app.enableCors(corsConfig);

  const port = process.env.PORT ?? 5000
  await app.listen(port);
  Logger.log(`🚀  Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
