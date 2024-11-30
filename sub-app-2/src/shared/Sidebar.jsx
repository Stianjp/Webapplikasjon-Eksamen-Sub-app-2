import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome for ikoner
import './Sidebar.css';
import LogoGreen from '../icons/LogoGreen.svg';
import HomeIcon from '../icons/house-solid.svg';
import ProductsIcon from '../icons/box-open-solid.svg';
import MyProductsIcon from '../icons/list-solid.svg';
import AddProductIcon from '../icons/circle-plus-solid.svg';
import AccountIcon from '../icons/gear-solid.svg';
import PrivacyIcon from '../icons/eye-solid.svg';
import LogoutIcon from '../icons/right-to-bracket-solid.svg';
import { FaUserCog } from "react-icons/fa";


const Sidebar = ({ isAuthenticated = false, roles = [], onLogout }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = roles.includes('Administrator');
  const isFoodProducer = roles.includes('FoodProducer');
  const isRegularUser = roles.includes('RegularUser');

  const getActiveClass = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsNavbarOpen(false); // Close the sidebar
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false); 
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="menu-toggle btn btn-outline-primary d-lg-none"
        onClick={toggleNavbar}
      >
        <i className={`fas ${isNavbarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar */}
      <div className={`navbar ${isNavbarOpen ? 'open' : ''}`}>
        <div className="sidebar-content d-flex flex-column flex-shrink-0 p-3">
          {/* Logo Section */}
          <div className="logo-section mb-4">
            <img className="logo" src={LogoGreen} alt="Logo of Food Bank" />
            <span className="navbar-brand">FoodBank</span>
          </div>
          <hr />

          {/* Navigation Links */}
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass('/')}`}
                to="/"
                onClick={closeNavbar}
              >
                <img src={HomeIcon} alt="Home page" className="icon" />
                <span>Home</span>
              </Link>
            </li>

            {/* Products Section */}
            <li className="nav-item">
              {isAuthenticated ? (
                <>
                  <Link
                    className={`nav-link ${getActiveClass('/products')}`}
                    to="/products"
                    onClick={closeNavbar}
                  >
                    <img src={ProductsIcon} alt="All products" className="icon" />
                    <span>Products</span>
                  </Link>
                  {(isAdmin || isFoodProducer || isRegularUser) && (
                    <ul className="nav flex-column sub-menu">
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${getActiveClass('/products')}`}
                          to="/products"
                          onClick={closeNavbar}
                        >
                          <img
                            src={ProductsIcon}
                            alt="View all products"
                            className="icon"
                          />
                          <span>View All</span>
                        </Link>
                      </li>
                      {!isRegularUser && (
                        <>
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${getActiveClass('/products/my')}`}
                              to="/products/my"
                              onClick={closeNavbar}
                            >
                              <img
                                src={MyProductsIcon}
                                alt="My products"
                                className="icon"
                              />
                              <span>My Products</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${getActiveClass('/products/add')}`}
                              to="/products/add"
                              onClick={closeNavbar}
                            >
                              <img
                                src={AddProductIcon}
                                alt="Add a product"
                                className="icon"
                              />
                              <span>Add Product</span>
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </>
              ) : (
                <a className="nav-link disabled" aria-disabled="true">
                  <img src={ProductsIcon} alt="Products" className="icon" />
                  <span>Products</span>
                </a>
              )}
            </li>

            {/* Account */}
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass('/account')}`}
                to="/account"
                onClick={closeNavbar}
              >
                <img src={AccountIcon} alt="Account settings" className="icon" />
                <span>Account</span>
              </Link>
            </li>

            {/* Privacy */}
            <li className="nav-item">
              <Link
                className={`nav-link ${getActiveClass('/privacy')}`}
                to="/privacy"
                onClick={closeNavbar}
              >
                <img src={PrivacyIcon} alt="Privacy policy" className="icon" />
                <span>Privacy</span>
              </Link>
            </li>
         

          {/* Admin Page */}
          <li className="nav-item">
          {(isAdmin) && (
            <Link className={`nav-link ${getActiveClass('/admin/users')}`} to="/admin/users" onClick={closeNavbar}>
            <FaUserCog className='icon' />
              <span>User Admin</span>
            </Link>
          )}
          </li>
          </ul>

          {/* Auth Section */}
          <div className="auth-section mt-auto">
            <hr />
            {isAuthenticated ? (
              <button
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <img src={LogoutIcon} alt="Logout" className="icon" />
                Logout
              </button>
            ) : (
              <Link
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                to="/account"
                onClick={closeNavbar}
              >
                <img src={LogoutIcon} alt="Login" className="icon" />
                Login
              </Link>
            )}
          </div>
        </div>
        {/* Overlay for closing on small screens */}
        {isNavbarOpen && <div className="overlay" onClick={closeNavbar}></div>}
      </div>
    </>
  );
};

export default Sidebar;
