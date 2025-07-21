import { useState, useEffect } from "react";
import { todoService } from "./services/todoService";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await todoService.getAllTodos();
      // Limit to first 10 todos for demo purposes
      setTodos(data.slice(0, 10));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search todos
  const searchTodos = async () => {
    if (!searchText.trim()) return;
    try {
      setSearching(true);
      setError("");
      const data = await todoService.searchTodos(searchText);
      setTodos(data);
    } catch (err) {
      setError(err.message);
      console.error("Error searching todos:", err);
    } finally {
      setSearching(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      setError("");
      const newTodoData = await todoService.createTodo({
        title: newTodo,
        completed: false,
      });

      // Add the new todo to the beginning of the list
      setTodos([{ ...newTodoData, id: Date.now() }, ...todos]);
      setNewTodo("");
    } catch (err) {
      setError(err.message);
      console.error("Error adding todo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedData) => {
    try {
      setLoading(true);
      setError("");
      await todoService.updateTodo(id, {
        ...todos.find((todo) => todo.id === id),
        ...updatedData,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedData } : todo
        )
      );
    } catch (err) {
      setError(err.message);
      console.error("Error updating todo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      setError("");
      await todoService.deleteTodo(id);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting todo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion
  const toggleComplete = async (id, completed) => {
    await updateTodo(id, { completed: !completed });
  };

  // Start editing
  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingText(title);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingText.trim()) return;

    await updateTodo(editingId, { title: editingText });
    setEditingId(null);
    setEditingText("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Todo App</h1>

        {error && <div className="error">{error}</div>}

        {/* Search todos */}
        <div className="search-todo">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search todos..."
            onKeyPress={(e) => e.key === "Enter" && searchTodos()}
            disabled={loading || searching}
          />
          <button
            onClick={searchTodos}
            disabled={loading || searching || !searchText.trim()}
          >
            Search
          </button>
          <button
            onClick={fetchTodos}
            disabled={loading || searching}
            style={{ marginLeft: "8px" }}
          >
            Reset
          </button>
        </div>

        {/* Add new todo */}
        <div className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo..."
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            disabled={loading}
          />
          <button onClick={addTodo} disabled={loading || !newTodo.trim()}>
            Add Todo
          </button>
        </div>

        {/* Loading indicator */}
        {(loading || searching) && <div className="loading">Loading...</div>}

        {/* Todo list */}
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
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                  disabled={loading}
                />
                {editingId === todo.id ? (
                  <div className="edit-input">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                    />
                    <button onClick={saveEdit} disabled={!editingText.trim()}>
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <span className="todo-title">{todo.title}</span>
                )}
              </div>
              {editingId !== todo.id && (
                <div className="todo-actions">
                  <button
                    onClick={() => startEditing(todo.id, todo.title)}
                    disabled={loading}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
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

        {todos.length === 0 && !loading && (
          <div className="empty-state">No todos yet. Add one above!</div>
        )}
      </div>
    </div>
  );
}

export default App;
