import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTodo(@Body() body: any, @Req() req: any) {
    const { title, description } = body;
    return this.todoService.createTodo(title, description, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTodos(@Req() req: any) {
    return this.todoService.getTodos(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTodo(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.todoService.updateTodo(id, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTodo(@Param('id') id: string, @Req() req: any) {
    return this.todoService.deleteTodo(id, req.user);
  }
}
