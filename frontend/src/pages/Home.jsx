import React, { useState, useEffect } from 'react';
import { Package, Search, X, ExternalLink, GitCompareArrows, PlusCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductDetailModal from '../components/ProductDetailModal';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Compare State
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareError, setCompareError] = useState('');
  const [aiWinner, setAiWinner] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const isInCompare = (product) => compareList.some((p) => p.name === product.name);

  const toggleCompare = (e, product) => {
    e.stopPropagation();
    setCompareError('');

    if (isInCompare(product)) {
      setCompareList((prev) => prev.filter((p) => p.name !== product.name));
      return;
    }

    if (compareList.length >= 3) {
      setCompareError('Maximum 3 modules can be analyzed concurrently.');
      return;
    }

    if (compareList.length > 0) {
      const existingCat = compareList[0].category.toLowerCase().trim();
      const newCat = product.category.toLowerCase().trim();
      if (existingCat !== newCat) {
        setCompareError(
          `Analysis mismatch. Target module must match base protocol [${compareList[0].category}]`
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
    setAiWinner(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setCompareOpen(true); // Open modal immediately to show loading state
    setAiWinner(null);
    try {
      const response = await fetch('/api/ai_verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: compareList })
      });
      if (response.ok) {
        const data = await response.json();
        setAiWinner(data.winner);
      }
    } catch (err) {
      console.error('AI Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const nameStr = p.name ? String(p.name).toLowerCase() : '';
    const catStr = p.category ? String(p.category).toLowerCase() : '';
    const searchStr = search.toLowerCase();
    return nameStr.includes(searchStr) || catStr.includes(searchStr);
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="page-container" style={{ padding: 0, maxWidth: '100%' }}
    >
      {/* Hero Section */}
      <header style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(200,99,251,0.15) 0%, rgba(15,19,28,0) 70%)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '4.5rem', color: 'var(--on-surface)', marginBottom: '1rem', lineHeight: '1.2' }}>
          Product <br /><span style={{ background: 'var(--primary)', color: 'white', padding: '0 1rem' }}>Hunt</span>
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem', fontFamily: 'var(--font-mono)', color: 'var(--on-surface-variant)' }}>
          [GLOBAL_PROJECT_REGISTRY] <br />
          Experience and acquire verified digital tools from the decentralized maker network.
        </p>

        <div className="input-field" style={{ maxWidth: '600px', margin: '0 auto', boxShadow: '4px 4px 0px black' }}>
          <Search size={20} className="text-muted" style={{ marginRight: '1rem' }} />
          <input
            type="text"
            placeholder="Search Registry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 6rem' }}>

        {compareError && (
          <div style={{ background: 'rgba(255,180,171,0.1)', color: 'var(--error)', padding: '1rem 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', border: '1px solid rgba(255,180,171,0.2)' }}>
            <span>{compareError}</span>
            <button onClick={() => setCompareError('')} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="glass-card skeleton-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="skeleton-box" style={{ width: '64px', height: '64px', flexShrink: 0, borderRadius: '1rem' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-text" style={{ width: '40%' }} />
                    <div className="skeleton-text" style={{ width: '70%', height: '1.25rem', marginTop: '0.25rem' }} />
                    <div className="skeleton-text" style={{ width: '30%' }} />
                  </div>
                </div>
                <div className="skeleton-text" style={{ width: '100%' }} />
                <div className="skeleton-text" style={{ width: '90%', marginBottom: '1.5rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                  <div className="skeleton-box" style={{ width: '100px', height: '32px', borderRadius: '999px' }} />
                  <div className="skeleton-box" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'var(--surface-container-low)', borderRadius: '1rem', border: '1px dashed var(--glass-border)' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No compatible entities detected.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {filteredProducts.map((product, idx) => {
              const inCompare = isInCompare(product);
              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{ cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', border: inCompare ? '2px solid var(--primary)' : '2px solid var(--secondary)', boxShadow: inCompare ? '6px 6px 0px var(--primary)' : 'var(--hard-shadow)' }}
                  onClick={() => handleViewProduct(product)}
                >
                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                      {product.name ? product.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <span className="neon-chip" style={{ fontSize: '0.6rem' }}>{product.category}</span>
                      <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginBottom: '0.25rem', color: 'var(--on-surface)' }}>{product.name}</h3>
                      <div style={{ color: 'var(--primary)', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>${product.price}</div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, color: 'var(--on-surface-variant)', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ExternalLink size={16} /> View Data
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.5rem', background: inCompare ? 'rgba(0,238,252,0.1)' : 'transparent', borderColor: inCompare ? 'var(--secondary)' : 'var(--glass-border)', color: inCompare ? 'var(--secondary)' : 'var(--on-surface)' }}
                      onClick={(e) => toggleCompare(e, product)}
                      title={inCompare ? 'Remove from analysis' : 'Add to analysis'}
                    >
                      {inCompare ? <CheckCircle size={18} /> : <PlusCircle size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--surface-container)', backdropFilter: 'blur(32px)', border: '1px solid var(--secondary)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '2rem', padding: '0.75rem 1.5rem', boxShadow: '0 10px 40px rgba(0, 238, 252, 0.2)', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,238,252,0.1)', padding: '0.5rem', borderRadius: '50%', color: 'var(--secondary)' }}>
              <GitCompareArrows size={20} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {compareList.map(p => (
                <div key={p.name} style={{ background: 'var(--surface-container-highest)', border: '1px solid var(--glass-border)', padding: '0.25rem 0.75rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--on-surface)' }}>
                  {p.name}
                  <button onClick={() => toggleCompare({ stopPropagation: () => { } }, p)} style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, var(--secondary), var(--secondary-container))', color: 'var(--on-secondary)' }}
              disabled={compareList.length < 2 || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Stack'}
            </button>
            <button onClick={clearCompare} style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear</button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {compareOpen && compareList.length >= 2 && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setCompareOpen(false)}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '1000px', maxHeight: '85vh', overflowY: 'auto', padding: '3rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setCompareOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--surface-container-high)', border: '1px solid var(--glass-border)', color: 'var(--on-surface-variant)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', marginBottom: '2.5rem', fontSize: '2rem' }}>
              <GitCompareArrows size={28} /> Cross-Analysis: {compareList[0].category}
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', width: '150px' }}>Vector</th>
                    {compareList.map(p => (
                      <th key={p.name} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '1.25rem', color: 'var(--on-surface)' }}>{p.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>License Cost</td>
                    {compareList.map(p => {
                      const prices = compareList.map(x => parseFloat(x.price));
                      const isBestPrice = parseFloat(p.price) === Math.min(...prices);
                      const isAiWinner = aiWinner && p.name.toLowerCase().trim() === aiWinner.toLowerCase().trim();
                      
                      return (
                        <td key={p.name} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: (isBestPrice || isAiWinner) ? 'var(--secondary)' : 'var(--on-surface)' }}>
                              ${p.price}
                            </span>
                            {isAnalyzing && (
                              <div className="skeleton-text" style={{ width: '80px', height: '0.75rem', marginBottom: 0 }} />
                            )}
                            {isAiWinner && (
                              <span className="neon-chip" style={{ fontSize: '0.6rem', alignSelf: 'start', background: 'rgba(233,179,255,0.1)', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                AI RECOMMENDED
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Specification</td>
                    {compareList.map(p => (
                      <td key={p.name} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--glass-border)', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>{p.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Supplier</td>
                    {compareList.map(p => (
                      <td key={p.name} style={{ padding: '1.5rem 1rem', color: 'var(--on-surface)' }}>{p.seller_email}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main product view modal */}
      <ProductDetailModal product={selectedProduct} loading={viewLoading} onClose={() => setSelectedProduct(null)} />
    </motion.div>
  );
};

export default Home;
