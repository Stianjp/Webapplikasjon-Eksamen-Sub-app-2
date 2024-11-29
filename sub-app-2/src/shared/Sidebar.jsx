import React from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import './Sidebar.css';
import LogoGreen from '../icons/LogoGreen.svg';
import HomeIcon from '../icons/house-solid.svg';
import ProductsIcon from '../icons/box-open-solid.svg';
import MyProductsIcon from '../icons/list-solid.svg';
import AddProductIcon from '../icons/circle-plus-solid.svg';
import AccountIcon from '../icons/gear-solid.svg';
import PrivacyIcon from '../icons/eye-solid.svg';
import LogoutIcon from '../icons/right-to-bracket-solid.svg';

const Sidebar = ({ isAuthenticated = false, roles = [], onLogout }) => {
  const location = useLocation();

  // Check roles
  const isAdmin = roles.includes('Administrator');
  const isFoodProducer = roles.includes('FoodProducer');
  const isRegularUser = roles.includes('RegularUser');

  // Function to determine active class
  const getActiveClass = (match) => {
    return match ? 'active' : ''; // Return 'active' class if the match exists, otherwise an empty string
  };

  // Get match results for different routes
  const homeMatch = useMatch('/');
  const productsMatch = useMatch('/products');
  const myProductsMatch = useMatch('/products/my');
  const addProductMatch = useMatch('/products/add');
  const accountMatch = useMatch('/account');
  const privacyMatch = useMatch('/privacy');

  return (
    <div className="sidebar-content d-flex flex-column flex-shrink-0 p-3">
      {/* Logo */}
      <img className="logo mb-4" src={LogoGreen} alt="Logo of Food Bank" />
      <span className="navbar-brand mb-4">FoodBank</span>
      <hr />

      {/* Navigation Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        {/* Home */}
        <li className="nav-item">
          <Link className={`nav-link ${getActiveClass(homeMatch)}`} to="/">
            <img src={HomeIcon} alt="Home page" className="icon" /> Home
          </Link>
        </li>

        {/* Products */}
        <li className="nav-item">
          {isAuthenticated ? (
            <>
              <Link className={`nav-link ${getActiveClass(productsMatch)}`} to="/products">
                <img src={ProductsIcon} alt="All products" className="icon" /> Products
              </Link>
              {(isAdmin || isFoodProducer || isRegularUser) && (
                <ul className="nav flex-column ms-3">
                  <li className="nav-item">
                    <Link className={`nav-link ${getActiveClass(productsMatch)}`} to="/products">
                      <img src={ProductsIcon} alt="View all products" className="icon" /> View All
                    </Link>
                  </li>
                  {!isRegularUser && (
                    <>
                      <li className="nav-item">
                        <Link className={`nav-link ${getActiveClass(myProductsMatch)}`} to="/products/my">
                          <img src={MyProductsIcon} alt="My products" className="icon" /> My Products
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${getActiveClass(addProductMatch)}`} to="/products/add">
                          <img src={AddProductIcon} alt="Add a product" className="icon" /> Add Product
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </>
          ) : (
            <a className="nav-link disabled" aria-disabled="true">
              <img src={ProductsIcon} alt="Products" className="icon" /> Products
            </a>
          )}
        </li>

        {/* Account */}
        <li className="nav-item">
          <Link className={`nav-link ${getActiveClass(accountMatch)}`} to="/account">
            <img src={AccountIcon} alt="Account settings" className="icon" /> Account
          </Link>
        </li>

        {/* Privacy */}
        <li className="nav-item">
          <Link className={`nav-link ${getActiveClass(privacyMatch)}`} to="/privacy">
            <img src={PrivacyIcon} alt="Privacy policy" className="icon" /> Privacy
          </Link>
        </li>
      </ul>
      <hr />

      {/* Authentication Actions */}
      <div className="logout mt-auto">
        {isAuthenticated ? (
          <button className="btn btn-danger d-flex align-items-center" onClick={onLogout}>
            <img src={LogoutIcon} alt="Logout" className="icon" /> Logout
          </button>
        ) : (
          <Link className="btn btn-primary d-flex align-items-center" to="/account">
            <img src={LogoutIcon} alt="Login" className="icon" /> Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
