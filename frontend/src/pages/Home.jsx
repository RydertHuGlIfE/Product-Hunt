import React, { useState, useEffect } from 'react';
import { Package, Search, X, ExternalLink, Tag, Info, GitCompareArrows, PlusCircle, CheckCircle } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ─── Compare State ───────────────────────────────────────────
  const [compareList, setCompareList] = useState([]);       // max 3 products
  const [compareOpen, setCompareOpen] = useState(false);    // compare modal
  const [compareError, setCompareError] = useState('');     // inline warning

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
      const response = await fetch('/api/consumer/view_displayed_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: product.name })
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data.product);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setViewLoading(false);
    }
  };

  // ─── Compare Logic ───────────────────────────────────────────
  const isInCompare = (product) =>
    compareList.some((p) => p.name === product.name);

  const toggleCompare = (e, product) => {
    e.stopPropagation(); // don't open the detail modal
    setCompareError('');

    if (isInCompare(product)) {
      // Remove from list
      setCompareList((prev) => prev.filter((p) => p.name !== product.name));
      return;
    }

    if (compareList.length >= 3) {
      setCompareError('Max 3 products can be compared at once.');
      return;
    }

    if (compareList.length > 0) {
      const existingCat = compareList[0].category.toLowerCase().trim();
      const newCat = product.category.toLowerCase().trim();
      if (existingCat !== newCat) {
        setCompareError(
          `Can only compare products of the same type. Current type: "${compareList[0].category}"`
        );
        return;
      }
    }

    setCompareList((prev) => [...prev, product]);
  };

  const clearCompare = () => {
    setCompareList([]);
    setCompareOpen(false);
    setCompareError('');
  };
  // ─────────────────────────────────────────────────────────────

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

      {/* ── Compare Error Banner ── */}
      {compareError && (
        <div className="compare-error-banner">
          <span>{compareError}</span>
          <button onClick={() => setCompareError('')}><X size={16} /></button>
        </div>
      )}

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
            {filteredProducts.map((product, idx) => {
              const inCompare = isInCompare(product);
              return (
                <div
                  key={idx}
                  className={`glass-card product-card ${inCompare ? 'compare-selected' : ''}`}
                  onClick={() => handleViewProduct(product)}
                >
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
                      <button className="view-btn" onClick={(e) => { e.stopPropagation(); handleViewProduct(product); }}>
                        <ExternalLink size={16} />
                      </button>
                      <button
                        className={`compare-btn ${inCompare ? 'compare-btn--active' : ''}`}
                        onClick={(e) => toggleCompare(e, product)}
                        title={inCompare ? 'Remove from compare' : 'Add to compare'}
                      >
                        {inCompare ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Floating Compare Bar ── */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-left">
            <GitCompareArrows size={20} />
            <span>{compareList.length} product{compareList.length > 1 ? 's' : ''} selected</span>
            <div className="compare-chips">
              {compareList.map((p) => (
                <span key={p.name} className="compare-chip">
                  {p.name}
                  <button onClick={() => toggleCompare({ stopPropagation: () => {} }, p)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="compare-bar-right">
            <button
              className="compare-now-btn"
              disabled={compareList.length < 2}
              onClick={() => setCompareOpen(true)}
            >
              Compare Now
            </button>
            <button className="compare-clear-btn" onClick={clearCompare}>Clear</button>
          </div>
        </div>
      )}

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>

            {viewLoading ? (
              <div className="modal-loader">
                <div className="loader"></div>
                <p>Fetching full details...</p>
              </div>
            ) : (
              <>
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
                    <button className="buy-btn">Get it Now</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Compare Modal ── */}
      {compareOpen && compareList.length >= 2 && (
        <div className="modal-overlay" onClick={() => setCompareOpen(false)}>
          <div className="glass-card compare-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setCompareOpen(false)}>
              <X size={24} />
            </button>
            <h2 className="compare-modal-title">
              <GitCompareArrows size={22} />
              Comparing {compareList[0].category} Products
            </h2>

            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="compare-attr-col">Attribute</th>
                    {compareList.map((p) => (
                      <th key={p.name}>
                        <div className="compare-th-icon">{p.name.charAt(0).toUpperCase()}</div>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="compare-attr">Category</td>
                    {compareList.map((p) => (
                      <td key={p.name}>
                        <span className="compare-badge">{p.category}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-attr">Price</td>
                    {compareList.map((p) => {
                      const prices = compareList.map((x) => parseFloat(x.price));
                      const minPrice = Math.min(...prices);
                      const isBest = parseFloat(p.price) === minPrice;
                      return (
                        <td key={p.name} className={isBest ? 'compare-best' : ''}>
                          ${p.price} {isBest && <span className="best-badge">Best</span>}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="compare-attr">Description</td>
                    {compareList.map((p) => (
                      <td key={p.name} className="compare-desc-cell">{p.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-attr">Seller</td>
                    {compareList.map((p) => (
                      <td key={p.name}>{p.seller_email || '—'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
