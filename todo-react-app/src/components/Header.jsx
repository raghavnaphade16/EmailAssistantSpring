function Header({ user, onLogout }) {
  return (
    <div className="header">
      <h1>Todo App</h1>
      {user && (
        <div className="user-info">
          <span className="welcome-text">Welcome, {user.name}!</span>
          <button 
            onClick={onLogout} 
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
