import React, { useState } from 'react';

const TodoItem = ({ todo, canEdit, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(todo._id, updatedText);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <>
          <input 
            type="text" 
            value={updatedText} 
            onChange={(e) => setUpdatedText(e.target.value)} 
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          {canEdit && <button onClick={handleEdit}>Edit</button>}
          {canEdit && <button onClick={() => onDelete(todo._id)}>Delete</button>}
        </>
      )}
    </li>
  );
};

export default TodoItem;
