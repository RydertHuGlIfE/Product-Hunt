import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/login/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Successfully authenticated as ${data.user.role.toUpperCase()}`);
        if (data.user.role === 'seller') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Invalid credentials');
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
      toast.error('Network Error: Database unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: 'var(--background)' }}
    >
      {/* Left split - Marketing */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', background: '#fff', borderRight: '2px solid black' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'black' }}>
          Product <br /><span style={{ background: 'var(--primary)', color: 'white', padding: '0 0.5rem' }}>Hunt</span>
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '400px', color: '#666', fontFamily: 'var(--font-mono)' }}>
          [GATEWAY_SECURE] <br />
          Experience and acquire verified digital tools from the global maker network.
        </p>
      </div>

      {/* Right split - Modal Auth */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Fingerprint className="text-primary" size={48} style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'black' }}>Access Gateway</h2>
            <p style={{ color: '#666', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>PROTOTYPE_ID: AUTH_REQUIRED</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,180,171,0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Role Toggle */}
            <div style={{ display: 'flex', background: '#eee', padding: '0.25rem', border: '2px solid black' }}>
              <button 
                type="button" 
                style={{ flex: 1, padding: '0.75rem', border: 'none', background: role === 'consumer' ? 'black' : 'transparent', color: role === 'consumer' ? 'white' : 'black', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-mono)' }}
                onClick={() => setRole('consumer')}
              >
                Hunter
              </button>
              <button 
                type="button" 
                style={{ flex: 1, padding: '0.75rem', border: 'none', background: role === 'seller' ? 'black' : 'transparent', color: role === 'seller' ? 'white' : 'black', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-mono)' }}
                onClick={() => setRole('seller')}
              >
                Maker
              </button>
            </div>

            <div className="input-field">
              <Mail size={20} className="text-muted" style={{ marginRight: '0.75rem' }} />
              <input
                type="email"
                placeholder="Enter ID (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <Lock size={20} className="text-muted" style={{ marginRight: '0.75rem' }} />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Ecosystem'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem' }} className="text-muted">
            Request Terminal Access? <Link to="/signup" className="text-secondary" style={{ textDecoration: 'none', fontWeight: '600' }}>Register Now</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
