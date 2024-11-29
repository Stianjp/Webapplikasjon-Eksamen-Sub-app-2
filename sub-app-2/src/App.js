import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import Home from './Home/Home';
import ProductPage from './Products/ProductPage';
import MyProducts from './Products/MyProducts';
import CreateProduct from './Products/CreateProduct';
import EditProduct from './Products/EditProduct';
import DeleteProduct from './Products/DeleteProduct';
import ProductDetails from './Products/ProductDetails';
import Account from './Home/Account';
import Privacy from './Home/Privacy';
import AdminUsers from './admin/AdminUsers';
import { jwtDecode } from 'jwt-decode'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  // Check authentication state on load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token to get roles
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
    localStorage.removeItem('authToken'); // Clear the token
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <Router>
      <div className="App d-flex">
        {/* Pass authentication state and handlers to Sidebar */}
        <Sidebar isAuthenticated={isAuthenticated} roles={roles} onLogout={handleLogout} />
        <main className="flex-grow-1 p-3">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Routes */}
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            {/* Pass handleLogin to Account */}
            <Route path="/account" element={<Account onLogin={handleLogin} />} />

            {/* Producer Routes */}
            <Route path="/products/my" element={<MyProducts />} />
            <Route path="/products/add" element={<CreateProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/delete-product/:id" element={<DeleteProduct />} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
