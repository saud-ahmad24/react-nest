import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://saudahmad24:v6FhgG0UPO3o1mbs@cluster0.gezq8.mongodb.net/todoAppSaud'),
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
