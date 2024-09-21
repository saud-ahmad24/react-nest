import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, canEdit, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(todo.title);
  const [updatedDescription, setUpdatedDescription] = useState(todo.description);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedTitle(todo.title);
    setUpdatedDescription(todo.description);
  };

  const handleSave = () => {
    if (!updatedTitle.trim() || !updatedDescription.trim()) {
      alert('Both title and description are required');
      return;
    }
    onUpdate(todo._id, updatedTitle, updatedDescription);
    setIsEditing(false);
  };

  return (
    <li className="todo-item">
      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="todo-input"
            placeholder="Title"
          />
          <input
            type="text"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="todo-input"
            placeholder="Description"
          />
          <div className="todo-actions">
            <button onClick={handleSave} className="todo-button save">Save</button>
            <button onClick={handleCancel} className="todo-button cancel">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="todo-display">
          <h4 className="todo-title">{todo.title}</h4>
          <p className="todo-description">{todo.description}</p>
          {canEdit && (
            <div className="todo-actions">
              <button onClick={handleEdit} className="todo-button edit">Edit</button>
              <button onClick={() => onDelete(todo._id)} className="todo-button delete">Delete</button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default TodoItem;
