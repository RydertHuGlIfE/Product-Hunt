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
            <>
              {user.role === 'seller' && (
                <Link to="/dashboard" className="nav-item">
                  <PlusSquare size={18} />
                  <span>Dashboard</span>
                </Link>
              )}
              <div className="user-profile">
                <span>{user.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="nav-item signup-btn">
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
