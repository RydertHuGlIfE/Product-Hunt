import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, LogIn, UserPlus, LogOut, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-header" style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Branding */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--secondary)',
            padding: '0.6rem',
            borderRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 2px 0px var(--primary)'
          }}>
            <Layers size={22} color="white" />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            color: 'var(--on-surface)',
            letterSpacing: '-0.03em'
          }}>
            Product Hunt
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {user.role === 'seller' && (
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--on-surface)', fontWeight: '700' }}>
                  <PlusSquare size={18} />
                  <span style={{ fontSize: '0.9rem' }}>Dashboard</span>
                </Link>
              )}
              
              {/* Technical Stats Widget */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                background: 'white', 
                padding: '0.4rem 0.75rem', 
                border: '2px solid black', 
                boxShadow: '2px 2px 0px black' 
              }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: '700', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '0.1rem 0.4rem' 
                }}>LIVE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>STORE LIVE</span>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                background: 'white', 
                padding: '0.5rem 1rem', 
                border: '2px solid var(--secondary)', 
                boxShadow: '2px 2px 0px var(--secondary)' 
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--on-surface)' }}>{user.email}</span>
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    background: 'var(--primary)', 
                    border: 'none', 
                    padding: '0.4rem', 
                    color: 'white', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--on-surface)', fontWeight: '700' }}>
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
