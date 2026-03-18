import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchStatus()
  }, [])

  return (
    <div className="container">
      <h1>React + Flask</h1>
      <p>Modern Boilerplate with Vite, React, and Flask API</p>
      
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
            <p style={{fontSize: '0.8rem'}}>Version: {data.version}</p>
          </div>
        )}
      </div>

      <button onClick={fetchStatus}>Refresh Connection</button>
    </div>
  )
}

export default App
