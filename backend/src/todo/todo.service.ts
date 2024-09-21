import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from '../schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

  async createTodo(title: string, description: string, user: any) {
    if (user.role === 'admin') {
      return this.todoModel.create({ title, description, createdBy: user.email });
    } else {
      throw new UnauthorizedException('You are not allowed to update this todo');
    }
  }

  async getTodos(user: any) {
    if (user.role === 'user') {
      return this.todoModel.find().exec();
    } else if(user.role == 'admin') {
      return this.todoModel.find({ createdBy: user.email }).exec();
    }
  }

  async updateTodo(id: string, update: any, user: any) {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (user.role == 'admin') {
      Object.assign(todo, update);
      return await todo.save();
    }
    if (todo.createdBy !== user.email || user.role !== 'admin') {
      throw new UnauthorizedException('You are not allowed to update this todo');
    }
  }

  async deleteTodo(id: string, user: any) {
    const todo = await this.todoModel.findById(id);
    if (!todo || (todo.createdBy !== user.email && user.role !== 'admin')) {
      throw new UnauthorizedException('You are not allowed to delete this todo');
    }
    return this.todoModel.findByIdAndDelete(id);
  }
}
