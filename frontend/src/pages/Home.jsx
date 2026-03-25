import { Package, Search, MoveUp, X, ExternalLink, Tag, Info } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

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

  const handleViewProduct = async (product) => {
    setSelectedProduct(product);
    setViewLoading(true);
    try {
      // Notify backend that product is being viewed
      await fetch('/api/consumer/view_displayed_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: product.name })
      });
    } catch (err) {
      console.error('Error logging product view:', err);
    } finally {
      setViewLoading(false);
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
              <div key={idx} className="glass-card product-card" onClick={() => handleViewProduct(product)}>
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
                  <div className="card-actions">
                    <button className="upvote-btn" onClick={(e) => { e.stopPropagation(); }}>
                      <MoveUp size={16} />
                      <span>24</span>
                    </button>
                    <button className="view-btn">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <div className="large-product-icon">
                {selectedProduct.name.charAt(0).toUpperCase()}
              </div>
              <div className="header-text">
                <h1>{selectedProduct.name}</h1>
                <span className="modal-category">{selectedProduct.category}</span>
              </div>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3><Info size={18} /> Description</h3>
                <p>{selectedProduct.description}</p>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <h3><Tag size={18} /> Price</h3>
                  <p className="highlight-price">${selectedProduct.price}</p>
                </div>
                <button className="buy-btn">
                  Get it Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
