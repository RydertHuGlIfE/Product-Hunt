import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, Trash2, Tag, DollarSign, TextQuote } from 'lucide-react';

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
    fetchMyProducts();
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Since backend doesn't link products to users yet, we show all products
        // for this demo purpose.
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newProduct = { name, price, category, description };

    try {
      const response = await fetch('/api/add_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        setProducts([newProduct, ...products]);
        setName(''); setPrice(''); setCategory(''); setDescription('');
      } else {
        alert('Failed to add product');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return;

    try {
      const response = await fetch('/api/delete_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName })
      });

      if (response.ok) {
        setProducts(products.filter(p => p.name !== productName));
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Manage your products and reach more customers.</p>
      </div>

      <div className="dashboard-grid">
        <section className="form-column">
          <div className="glass-card form-card">
            <h2>
              <PlusCircle className="header-icon" />
              Add New Product
            </h2>
            <form onSubmit={handleAddProduct} className="dashboard-form">
              <div className="input-field">
                <Tag size={18} />
                <input 
                  type="text" 
                  placeholder="Product Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="input-field">
                <ShoppingBag size={18} />
                <input 
                  type="text" 
                  placeholder="Category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required 
                />
              </div>
              <div className="input-field">
                <DollarSign size={18} />
                <input 
                  type="number" 
                  placeholder="Price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required 
                />
              </div>
              <div className="input-field textarea-field">
                <TextQuote size={18} />
                <textarea 
                  placeholder="Description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="add-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </section>

        <section className="list-column">
          <h2>Your Active Products ({products.length})</h2>
          <div className="dashboard-list">
            {products.length === 0 ? (
              <p className="no-items">You haven't added any products yet.</p>
            ) : (
              products.map((p, idx) => (
                <div key={idx} className="glass-card mini-product-card">
                  <div className="mini-info">
                    <h3>{p.name}</h3>
                    <span className="mini-badge">{p.category}</span>
                  </div>
                  <div className="mini-actions">
                    <span className="mini-price">${p.price}</span>
                    <button onClick={() => handleDelete(p.name)} className="delete-icon-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
