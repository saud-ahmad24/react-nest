import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { Todo } from '../schemas/todo.schema';
import { UnauthorizedException } from '@nestjs/common';

const mockTodoModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  exec: jest.fn(),
  save: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getModelToken(Todo.name), useValue: mockTodoModel },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new todo', async () => {
    const todo = { title: 'Test', description: 'Test description', createdBy: 'user@example.com' };
    mockTodoModel.save.mockResolvedValue(todo);

    const result = await service.createTodo(todo.title, todo.description, todo.createdBy);
    expect(result).toEqual(todo);
    expect(mockTodoModel.save).toHaveBeenCalled();
  });

  it('should get todos for regular user', async () => {
    const user = { role: 'user', email: 'user@example.com' };
    mockTodoModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([{}]) });

    const result = await service.getTodos(user);
    expect(result).toEqual([{}]);
    expect(mockTodoModel.find).toHaveBeenCalled();
  });

  it('should allow only owner or admin to update a todo', async () => {
    const user = { role: 'user', email: 'user@example.com' };
    const todo = { _id: '1', createdBy: 'user@example.com', title: 'Test' };
    mockTodoModel.findById.mockResolvedValue(todo);
    mockTodoModel.save.mockResolvedValue(todo);

    const result = await service.updateTodo('1', { title: 'Updated' }, user);
    expect(result).toEqual(todo);
    expect(mockTodoModel.findById).toHaveBeenCalledWith('1');
  });

  it('should throw an error if a non-owner tries to update a todo', async () => {
    const user = { role: 'user', email: 'another@example.com' };
    const todo = { _id: '1', createdBy: 'user@example.com', title: 'Test' };
    mockTodoModel.findById.mockResolvedValue(todo);

    await expect(service.updateTodo('1', { title: 'Updated' }, user)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should delete a todo for owner or admin', async () => {
    const user = { role: 'admin', email: 'admin@example.com' };
    const todo = { _id: '1', createdBy: 'user@example.com' };
    mockTodoModel.findById.mockResolvedValue(todo);
    mockTodoModel.findByIdAndDelete.mockResolvedValue(todo);

    const result = await service.deleteTodo('1', user);
    expect(result).toEqual(todo);
    expect(mockTodoModel.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
