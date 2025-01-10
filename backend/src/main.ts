import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Создаем приложение с типом NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Путь к папке uploads
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('Uploads path:', uploadsPath);

  // Обслуживаем статические файлы
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads', // Путь, по которому будут доступны файлы
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
