import React, { useState, useEffect } from 'react';
import { Package, Search, MoveUp } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container home-page">
      <header className="hero-section">
        <h1>Discover the next big thing</h1>
        <p>The best new products, every day.</p>
        
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products or categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <section className="product-feed">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading the latest products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>No products found yet. Be the first to add one!</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, idx) => (
              <div key={idx} className="glass-card product-card">
                <div className="card-content">
                  <div className="product-icon">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="desc">{product.description}</p>
                    <div className="price-tag">${product.price}</div>
                  </div>
                  <button className="upvote-btn">
                    <MoveUp size={16} />
                    <span>24</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
