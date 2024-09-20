import React, { useContext, useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import AuthContext from '../context/AuthContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { currentUser } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      const response = await fetchTodos();
      setTodos(response.data);
    };
    loadTodos();
  }, []);

  const handleCreateTodo = async () => {
    const response = await createTodo({ text: newTodo });
    setTodos([...todos, response.data]);
    setNewTodo('');
  };

  const handleUpdateTodo = async (id, updatedText) => {
    const response = await updateTodo(id, { text: updatedText });
    setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      {currentUser?.role === 'admin' && (
        <div>
          <input 
            type="text" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
            placeholder="New Todo" 
          />
          <button onClick={handleCreateTodo}>Add Todo</button>
        </div>
      )}

      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            canEdit={currentUser?.role === 'admin'}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
