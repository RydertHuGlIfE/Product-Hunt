import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, LogIn, UserPlus, LogOut, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Layout className="logo-icon" />
          <span>Product Hunt</span>
        </Link>
        
        <div className="nav-links">
          {user ? (
            <div className="nav-profile-group">
              {user.role === 'seller' && (
                <Link to="/dashboard" className="nav-item">
                  <PlusSquare size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              <div className="user-profile">
                <span className="user-email-tag">{user.email}</span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-nav-links">
              <Link to="/login" className="nav-item">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-item signup-cta">
                <UserPlus size={18} />
                <span>Join Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
