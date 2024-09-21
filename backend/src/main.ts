import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000
  // app.enableCors({
  //   origin: 'https://react-frontend-gray-five.vercel.app',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });  

  await app.listen(port);
}
bootstrap();
