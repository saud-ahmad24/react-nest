import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async createTodo(title: string, description: string, createdBy: string) {
    const todo = new this.todoModel({ title, description, createdBy });
    return todo.save();
  }

  async getTodos(user: any) {
    console.log(user)
    if (user.role === 'user') {
      return this.todoModel.find().exec();
    } else {
      return this.todoModel.find({ createdBy: user.email }).exec();
    }
  }

  async updateTodo(id: string, update: any, user: any) {
    const todo = await this.todoModel.findById(id);
    if (!todo || (todo.createdBy !== user.email && user.role !== 'admin')) {
      throw new UnauthorizedException('You are not allowed to update this todo');
    }
    Object.assign(todo, update);
    return todo.save();
  }

  async deleteTodo(id: string, user: any) {
    const todo = await this.todoModel.findById(id);
    if (!todo || (todo.createdBy !== user.email && user.role !== 'admin')) {
      throw new UnauthorizedException('You are not allowed to delete this todo');
    }
    return this.todoModel.findByIdAndDelete(id);
  }
}
