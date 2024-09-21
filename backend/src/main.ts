import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000
  app.enableCors({
    origin: ['http://localhost:3000', 'https://react-frontend-256ds8jmd-sauds-projects-edd06d50.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials if needed
  })
  await app.listen(port);
}
bootstrap();
