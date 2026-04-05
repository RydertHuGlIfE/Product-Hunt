import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-main">
        <Toaster theme="dark" position="bottom-right" toastOptions={{ className: 'glass-panel' }} />
        <Navbar />
        <main className="content">
          <AnimatedRoutes />
        </main>
        <footer className="main-footer">
          <p>&copy; 2026 Product Hunt. Built with passion.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
