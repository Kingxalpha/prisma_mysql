import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
// import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  // app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
