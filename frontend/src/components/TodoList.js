import React, { useContext, useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import AuthContext from '../context/AuthContext';
import TodoItem from './TodoItem';
import './TodoItem'; // Ensure you have your CSS file for styling

const TodoList = () => {
  const { currentUser, handleLogout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      const response = await fetchTodos();
      setTodos(response.data);
    };
    loadTodos();
  }, []);

  const handleCreateTodo = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Both title and description are required');
      return;
    }
    const response = await createTodo({ title: newTitle, description: newDescription });
    setTodos([...todos, response.data]);
    setNewTitle('');
    setNewDescription('');
  };

  const handleUpdateTodo = async (id, updatedTitle, updatedDescription) => {
    const response = await updateTodo(id, { title: updatedTitle, description: updatedDescription });
    setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(todo => todo._id !== id));
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {currentUser?.role === 'admin' && (
        <div className="todo-form">
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            placeholder="Todo Title" 
            className="todo-input"
          />
          <input 
            type="text" 
            value={newDescription} 
            onChange={(e) => setNewDescription(e.target.value)} 
            placeholder="Todo Description" 
            className="todo-input"
          />
          <button onClick={handleCreateTodo} className="todo-button">Add Todo</button>
        </div>
      )}

      <ul className="todo-list-items">
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
