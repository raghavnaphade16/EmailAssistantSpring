function TodoList({ 
  todos, 
  onToggleComplete, 
  onStartEditing, 
  onDelete, 
  editingId, 
  editingText, 
  onEditTextChange, 
  onSaveEdit, 
  onCancelEdit, 
  loading 
}) {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`todo-item ${todo.completed ? "completed" : ""}`}
        >
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleComplete(todo.id, todo.completed)}
              disabled={loading}
            />
            {editingId === todo.id ? (
              <div className="edit-input">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => onEditTextChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
                  autoFocus
                />
                <button onClick={onSaveEdit} disabled={!editingText.trim()}>
                  Save
                </button>
                <button onClick={onCancelEdit}>Cancel</button>
              </div>
            ) : (
              <span className="todo-title">{todo.title}</span>
            )}
          </div>
          {editingId !== todo.id && (
            <div className="todo-actions">
              <button
                onClick={() => onStartEditing(todo.id, todo.title)}
                disabled={loading}
                className="edit-btn"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                disabled={loading}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoList;
