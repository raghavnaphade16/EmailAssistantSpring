import { useState } from "react";

function LoginForm({ onLogin, onSwitchToSignup, loading, error }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email.trim() && formData.password.trim()) {
      onLogin(formData);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your todos</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading || !formData.email.trim() || !formData.password.trim()}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            Don't have an account?{" "}
            <button 
              type="button" 
              className="link-button" 
              onClick={onSwitchToSignup}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
