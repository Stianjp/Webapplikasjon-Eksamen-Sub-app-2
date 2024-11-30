import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import Home from './pages/public/Home';
import ProductPage from './Products/ProductPage';
import MyProducts from './pages/foodproducer/MyProducts';
import CreateProduct from './components/shared/CreateProduct';
import ProductDetails from './components/shared/ProductDetails';
import Account from './pages/public/Account';
import Privacy from './pages/public/Privacy';
import AdminUsers from './pages/admin/AdminUsers';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setRoles(decodedToken['role'] || decodedToken['roles'] || []);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuthenticated(false);
        setRoles([]);
      }
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsAuthenticated(true);
    setRoles(loginData.roles || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <nav className="sidebar-wrapper">
          <Sidebar 
            isAuthenticated={isAuthenticated} 
            roles={roles} 
            onLogout={handleLogout} 
          />
        </nav>
        <main className="content-wrapper">
          <div className="content-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Routes */}
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/account" element={<Account onLogin={handleLogin} />} />

              {/* Producer Routes */}
              <Route path="/products/my" element={<MyProducts />} />
              <Route path="/products/add" element={<CreateProduct />} />
        
              {/* Admin Routes */}
              <Route path="/admin/users" element={<AdminUsers />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;