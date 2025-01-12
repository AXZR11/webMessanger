import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Включаем CORS для обычных HTTP-запросов
  app.enableCors({
    origin: 'http://localhost:8080', // Разрешаем доступ с клиента
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Настройка IoAdapter для socket.io
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  // Путь к папке uploads
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Uploads path:', uploadsPath);

  // Обслуживаем статические файлы
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  // Настроим CORS напрямую в Socket.IO

  await app.listen(Number(process.env.PORT) || 3000);
}

bootstrap();

