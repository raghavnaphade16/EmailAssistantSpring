import axios from "axios";

// API base URL - replace with your actual API endpoint
// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos'

// You can also use a local API if you have one running
const API_BASE_URL = "http://localhost:8080/api/todo";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export const todoService = {
  // Get all todos
  getAllTodos: async () => {
    try {
      const response = await api.get("/getAllTodos");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch todos");
    }
  },

  // Get todo by ID
  getTodoById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch todo with ID: ${id}`);
    }
  },

  // Create new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post("/createTodo", {
        title: todoData.title,
        completed: todoData.completed || false,
        userId: todoData.userId || 1,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to create todo");
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/updateTodo/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update todo with ID: ${id}`);
    }
  },

  // Partially update todo
  patchTodo: async (id, partialData) => {
    try {
      const response = await api.patch(`/${id}`, partialData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to patch todo with ID: ${id}`);
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    try {
      await api.delete(`/deleteTodo/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete todo with ID: ${id}`);
    }
  },

  // Get todos by user ID
  getTodosByUserId: async (userId) => {
    try {
      const response = await api.get(`?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch todos for user ID: ${userId}`);
    }
  },

  // Search todos by title
  searchTodos: async (query) => {
    try {
      // Use /searchTodo/{searchText} endpoint
      const response = await api.get(
        `/searchTodo/${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to search todos");
    }
  },
};

export default todoService;
