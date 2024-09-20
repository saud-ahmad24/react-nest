import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-todo-app'), // Replace with your MongoDB URI
    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}
