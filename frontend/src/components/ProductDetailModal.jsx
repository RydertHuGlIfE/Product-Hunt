import React from 'react';
import { X, Info, Tag, ShoppingCart, Activity } from 'lucide-react';

const ProductDetailModal = ({ product, loading, onClose }) => {
  if (!product && !loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }} onClick={onClose}>
      
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '500px'
      }} onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'var(--surface-container-high)',
          border: '1px solid var(--glass-border)',
          color: 'var(--on-surface-variant)',
          borderRadius: '50%', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10
        }} className="hover:text-white transition-colors">
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Activity size={48} className="animate-pulse" style={{ marginBottom: '1rem' }} />
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Accessing Data...</span>
          </div>
        ) : (
          <>
            {/* Left side: Immersive Visual Container */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(200,99,251,0.2) 0%, rgba(0,238,252,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRight: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: '180px', height: '180px',
                background: 'var(--surface-container-highest)',
                borderRadius: '3rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem', fontWeight: '800', fontFamily: 'var(--font-display)',
                color: 'var(--primary)',
                border: '1px solid rgba(233, 179, 255, 0.3)',
                boxShadow: '0 0 60px rgba(233, 179, 255, 0.2)'
              }}>
                {product.name ? product.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>

            {/* Right side: Product Data */}
            <div style={{
              flex: 1,
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="neon-chip" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                  {product.category}
                </span>
                <h1 style={{ fontSize: '3rem', lineHeight: '1.1', marginBottom: '0.5rem', color: 'var(--on-surface)' }}>
                  {product.name}
                </h1>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                  Supplied by: <span style={{ color: 'var(--secondary)' }}>{product.seller_email}</span>
                </p>
              </div>

              <div style={{ flex: 1, marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--on-surface)', marginBottom: '1rem', fontSize: '1.25rem' }}>
                  <Info size={20} className="text-primary" /> Technical Description
                </h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                  {product.description}
                </p>
              </div>

              <div style={{
                marginTop: 'auto',
                paddingTop: '2rem',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--on-surface-variant)', marginBottom: '0.25rem' }}>
                    <Tag size={16} /> <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>License Cost</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--secondary)' }}>
                    ${product.price}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;
