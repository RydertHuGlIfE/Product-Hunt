import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, Trash2, Tag, DollarSign, TextQuote, Box, BarChart2, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchMyProducts();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    try {
      const response = await fetch(`/api/seller/products?email=${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newProduct = { name, price, category, description, email: user.email };

    try {
      const response = await fetch('/api/seller/add_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        setProducts([newProduct, ...products]);
        setName(''); setPrice(''); setCategory(''); setDescription('');
        toast.success('Terminal module broadcasted successfully.');
      } else {
        toast.error('Failed to register terminal module.');
      }
    } catch (err) {
      toast.error('Network Error: Database unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productName) => {
    if (!window.confirm(`Deactivate "${productName}" from the global registry?`)) return;

    try {
      const response = await fetch('/api/delete_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName, email: user.email })
      });

      if (response.ok) {
        setProducts(products.filter(p => p.name !== productName));
        toast.success(`Deactivated module: ${productName}`);
      }
    } catch (err) {
      toast.error('Network error. Database disconnected.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', borderRight: '1px solid var(--glass-border)', background: 'var(--surface-container-low)', padding: '2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem' }}>Supplier Controls</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(233, 179, 255, 0.1)', color: 'var(--primary)', border: '1px solid rgba(233,179,255,0.2)', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'left', fontWeight: '600' }}>
              <Box size={20} /> Module Registry
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem', background: 'var(--surface-container-lowest)' }}>
        
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '3rem', color: 'var(--on-surface)', marginBottom: '0.5rem' }}>Control System</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Initialize new modules or manage active endpoints.</p>
        </div>

        {/* Add Product Form - Horizontal layout */}
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', marginBottom: '2rem', fontSize: '1.5rem' }}>
            <PlusCircle size={24} /> Initialize Terminal Module
          </h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-field" style={{ background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)' }}>
              <Tag size={18} className="text-muted" style={{ marginRight: '0.75rem' }} />
              <input 
                type="text" 
                placeholder="Entity Designation (Name)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="input-field" style={{ background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)' }}>
              <ShoppingBag size={18} className="text-muted" style={{ marginRight: '0.75rem' }} />
              <input 
                type="text" 
                placeholder="Protocol Class (Category)" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required 
              />
            </div>
            <div className="input-field" style={{ gridColumn: '1 / -1', background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)' }}>
              <TextQuote size={18} className="text-muted" style={{ marginRight: '0.75rem', alignSelf: 'flex-start', marginTop: '1rem' }} />
              <textarea 
                placeholder="Technical Specification (Description)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
              />
            </div>
            <div className="input-field" style={{ background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)' }}>
              <DollarSign size={18} className="text-muted" style={{ marginRight: '0.75rem' }} />
              <input 
                type="number" 
                placeholder="License Value" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '1rem 2rem', width: '100%' }} disabled={loading}>
                {loading ? 'Transmitting Data...' : 'Broadcast Module'}
              </button>
            </div>
          </form>
        </div>

        {/* Product List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--on-surface)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Active Registrations <span style={{ background: 'var(--surface-container-high)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>{products.length}</span>
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-container-low)', borderRadius: '1rem', border: '1px dashed var(--glass-border)' }}>
                <p className="text-muted">No operational modules detected for this terminal.</p>
              </div>
            ) : (
              products.map((p, idx) => (
                <div key={idx} style={{ padding: '1.5rem 2rem', background: 'var(--surface-container-low)', border: '1px solid var(--glass-border)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s ease', cursor: 'default' }} className="hover:border-[var(--secondary)]">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--on-surface)', marginBottom: '0.25rem' }}>{p.name}</h3>
                      <span className="neon-chip">{p.category}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                      ${p.price}
                    </div>
                    <button 
                      onClick={() => handleDelete(p.name)} 
                      className="btn-danger"
                      title="Deactivate Module"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
