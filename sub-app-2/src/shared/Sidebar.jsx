import React from 'react';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const isAdmin = roles.includes('Administrator');
  const isFoodProducer = roles.includes('FoodProducer');
  const isRegularUser = roles.includes('RegularUser');

  const getActiveClass = (match) => match ? 'active' : '';

  const homeMatch = useMatch('/');
  const productsMatch = useMatch('/products');
  const myProductsMatch = useMatch('/products/my');
  const addProductMatch = useMatch('/products/add');
  const accountMatch = useMatch('/account');
  const privacyMatch = useMatch('/privacy');

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="sidebar-content d-flex flex-column flex-shrink-0 p-3">
        {/* Logo Section */}
        <div className="logo-section mb-4">
          <img className="logo" src={LogoGreen} alt="Logo of Food Bank" />
          <span className="navbar-brand">FoodBank</span>
        </div>
        <hr />

        {/* Navigation Links */}
        <ul className="nav nav-pills flex-column mb-auto">
          {/* Home */}
          <li className="nav-item">
            <Link className={`nav-link ${getActiveClass(homeMatch)}`} to="/">
              <img src={HomeIcon} alt="Home page" className="icon" />
              <span>Home</span>
            </Link>
          </li>

          {/* Products Section */}
          <li className="nav-item">
            {isAuthenticated ? (
              <>
                <Link className={`nav-link ${getActiveClass(productsMatch)}`} to="/products">
                  <img src={ProductsIcon} alt="All products" className="icon" />
                  <span>Products</span>
                </Link>
                {(isAdmin || isFoodProducer || isRegularUser) && (
                  <ul className="nav flex-column sub-menu">
                    <li className="nav-item">
                      <Link className={`nav-link ${getActiveClass(productsMatch)}`} to="/products">
                        <img src={ProductsIcon} alt="View all products" className="icon" />
                        <span>View All</span>
                      </Link>
                    </li>
                    {!isRegularUser && (
                      <>
                        <li className="nav-item">
                          <Link className={`nav-link ${getActiveClass(myProductsMatch)}`} to="/products/my">
                            <img src={MyProductsIcon} alt="My products" className="icon" />
                            <span>My Products</span>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className={`nav-link ${getActiveClass(addProductMatch)}`} to="/products/add">
                            <img src={AddProductIcon} alt="Add a product" className="icon" />
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
            <Link className={`nav-link ${getActiveClass(accountMatch)}`} to="/account">
              <img src={AccountIcon} alt="Account settings" className="icon" />
              <span>Account</span>
            </Link>
          </li>

          {/* Privacy */}
          <li className="nav-item">
            <Link className={`nav-link ${getActiveClass(privacyMatch)}`} to="/privacy">
              <img src={PrivacyIcon} alt="Privacy policy" className="icon" />
              <span>Privacy</span>
            </Link>
          </li>
        </ul>

        {/* Auth Section */}
        <div className="auth-section">
          <hr />
          <div className="logout">
            {isAuthenticated ? (
              <button 
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <img src={LogoutIcon} alt="Logout" className="icon" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                to="/account"
              >
                <img src={LogoutIcon} alt="Login" className="icon" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
