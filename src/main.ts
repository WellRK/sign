import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );


  server.set('view engine', 'pug');
  server.set('views', join(__dirname, '..', 'views'));

  await app.listen(3000);
}
bootstrap();
