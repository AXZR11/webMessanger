import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:8080', 'https://zhirnow.ru.tuna.am'],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Uploads path:', uploadsPath);

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  await app.listen(Number(process.env.PORT) || 3000);
}

bootstrap();

