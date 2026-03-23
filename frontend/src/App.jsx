import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Product Form State
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productDesc, setProductDesc] = useState('')
  const [products, setProducts] = useState([])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/status')
      if (!response.ok) throw new Error('Backend unreachable')
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      // In a real app, you'd have an endpoint for this.
      // For now, we just fetch assuming the backend handles it or we show what we added.
      // Let's assume there's no GET /api/products yet, but we'll show the added ones.
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    const newProduct = {
      name: productName,
      price: productPrice,
      description: productDesc
    }

    try {
      const response = await fetch('/api/add_products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      })

      if (response.ok) {
        alert('Product added successfully!')
        setProducts([...products, newProduct])
        setProductName('')
        setProductPrice('')
        setProductDesc('')
      } else {
        const errData = await response.json()
        alert('Error: ' + (errData.error || 'Failed to add product'))
      }
    } catch (err) {
      alert('Network Error: ' + err.message)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="container">
      <h1>Product Hunt Admin</h1>
      <p className="subtitle">Manage your MongoDB product catalog</p>
      
      <div className="status-card">
        {loading ? (
          <p>Connecting to backend...</p>
        ) : error ? (
          <div>
            <span className="status-indicator status-offline"></span>
            <p>Backend Status: <span style={{color: '#ef4444'}}>Offline</span></p>
            <p style={{fontSize: '0.8rem', marginTop: '5px'}}>{error}</p>
          </div>
        ) : (
          <div>
            <span className="status-indicator status-online"></span>
            <p>Backend Status: <span style={{color: '#10b981'}}>Online</span></p>
            <p style={{marginTop: '10px'}}>{data.message}</p>
            <p style={{fontSize: '0.8rem'}}>DB Status: <strong>{data.db_status || 'Checking...'}</strong></p>
          </div>
        )}
      </div>

      <div className="form-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct} className="product-form">
          <input 
            type="text" 
            placeholder="Product Name" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={productPrice} 
            onChange={(e) => setProductPrice(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="Description" 
            value={productDesc} 
            onChange={(e) => setProductDesc(e.target.value)} 
          />
          <button type="submit" className="add-btn">Add Product</button>
        </form>
      </div>

      <div className="list-section">
        <h2>Recent Products ({products.length})</h2>
        <div className="product-list">
          {products.length === 0 ? (
            <p className="no-products">No products added yet.</p>
          ) : (
            products.map((p, index) => (
              <div key={index} className="product-card">
                <h3>{p.name}</h3>
                <p className="price">${p.price}</p>
                <p className="desc">{p.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={fetchStatus} className="refresh-btn">Refresh Connection</button>
    </div>
  )
}

export default App
