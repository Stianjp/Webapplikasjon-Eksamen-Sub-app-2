import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

import Sidebar from './shared/Sidebar';
import Home from './Home/Home';
import Privacy from './Home/Privacy';
import ProductPage from './foodproducerProductPage';
import ProductDetails from './component/ProductDetails';
import Account from './Home/Account';
import MyProducts from './foodproducer/MyProducts';
import CreateProduct from './component/CreateProduct';
import AdminUsers from './admin/AdminUsers';
import AdminProductpage from './admin/AdminProductpage'; // Add this line
import ProtectedRoute from './shared/ProtectedRoute';
import NotAuthorized from './shared/NotAuthorized';

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
              <Route
                path="/products/my"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    roles={roles}
                    requiredRole="FoodProducer"
                  >
                    <MyProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/add"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    roles={roles}
                    requiredRole="FoodProducer"
                  >
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    roles={roles}
                    requiredRole="Administrator"
                  >
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    roles={roles}
                    requiredRole="Administrator"
                  >
                    <AdminProductpage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route for unauthorized access */}
              <Route path="*" element={<NotAuthorized />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;