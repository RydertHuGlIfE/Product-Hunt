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
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 19, 28, 0.7)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1rem 0'
    }}>
      <div style={{
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
            background: 'linear-gradient(135deg, var(--on-surface-variant), var(--on-surface))',
            padding: '0.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} color="var(--background)" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--on-surface)' }}>
            Product Hunt
          </span>
        </Link>

        {/* Search Bar Placeholder (Usually handled inside specific view) */}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {user.role === 'seller' && (
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--on-surface-variant)' }}>
                  <PlusSquare size={18} />
                  <span style={{ fontWeight: '500' }}>Dashboard</span>
                </Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface-container-low)', padding: '0.5rem 0.5rem 0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--on-surface)' }}>{user.email}</span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'var(--surface-container-highest)', border: 'none', padding: '0.5rem', borderRadius: '50%', color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Disconnect Terminal"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--on-surface)', fontWeight: '600' }}>
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
