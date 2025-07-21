import { useState, useEffect } from "react";
import { todoService } from "./services/todoService";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import "./App.css";

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // "login", "signup", "todos"
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Todo state
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  // Check for existing user session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("todoAppUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentView("todos");
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("todoAppUser");
      }
    }
  }, []);

  // Fetch todos when user logs in
  useEffect(() => {
    if (user && currentView === "todos") {
      fetchTodos();
    }
  }, [user, currentView]);

  // Authentication functions
  const handleLogin = async (formData) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      const userData = {
        id: Date.now(),
        name: formData.email.split("@")[0],
        email: formData.email
      };
      
      setUser(userData);
      localStorage.setItem("todoAppUser", JSON.stringify(userData));
      setCurrentView("todos");
    } catch (err) {
      setAuthError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    try {
      setAuthLoading(true);
      setAuthError("");
      
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid form data
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email
      };
      
      setUser(userData);
      localStorage.setItem("todoAppUser", JSON.stringify(userData));
      setCurrentView("todos");
    } catch (err) {
      setAuthError("Signup failed. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("login");
    setTodos([]);
    setNewTodo("");
    setEditingId(null);
    setEditingText("");
    setSearchText("");
    setError("");
    setAuthError("");
    localStorage.removeItem("todoAppUser");
  };

  const switchToSignup = () => {
    setCurrentView("signup");
    setAuthError("");
  };

  const switchToLogin = () => {
    setCurrentView("login");
    setAuthError("");
  };

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

  // Render authentication views
  if (!user) {
    if (currentView === "signup") {
      return (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={switchToLogin}
          loading={authLoading}
          error={authError}
        />
      );
    }
    
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // Render todo app for authenticated users
  return (
    <div className="app">
      <div className="container">
        <Header user={user} onLogout={handleLogout} />

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
        <TodoList
          todos={todos}
          onToggleComplete={toggleComplete}
          onStartEditing={startEditing}
          onDelete={deleteTodo}
          editingId={editingId}
          editingText={editingText}
          onEditTextChange={setEditingText}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          loading={loading}
        />

        {todos.length === 0 && !loading && (
          <div className="empty-state">No todos yet. Add one above!</div>
        )}
      </div>
    </div>
  );
}

export default App;
