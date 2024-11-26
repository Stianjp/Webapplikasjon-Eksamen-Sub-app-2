/* Nessesery imports */
import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
/* CSS imports */
import './Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/* Icon imports */
import SolidList from '../icons/list-solid.svg';
import SolidCircle from '../icons/circle-plus-solid.svg';
import EyeSolid from '../icons/eye-solid.svg';
import BowlSolid from '../icons/bowl-food-solid.svg';
import Home from '../icons/house-solid.svg';
import LogoGreen from '../icons/LogoGreen.svg'; 
import AccountGear from '../icons/gear-solid.svg';
import PrivacyIcon from '../icons/bowl-food-solid.svg';
import MyAccount from '../icons/gauge-solid.svg';
import Logout from '../icons/right-to-bracket-solid.svg';

const Sidebar: React.FC = () => {
  return (
    <div className="d-flex flex-column vh-100 bg-light shadow" style={{ width: '250px' }}>
      <div className="p-3 text-center border-bottom">
        <img src={LogoGreen} alt="Logo" className="mb-3" style={{ width: '50px' }} />
        <h1 className="h5 mb-0">FoodBank</h1>
      </div>
      <Nav className="flex-column nav-pills mt-3 flex-grow-1">
        <Nav.Link as={Link} to="/" className="text-dark d-flex align-items-center p-3">
          <img src={Home} alt="Home" className="icon" /> Home
        </Nav.Link>
        <NavDropdown
          title={
            <span>
              <img src={BowlSolid} alt="List of all products" className="icon" /> Products
            </span>
          }
          className="text-dark d-flex align-items-center p-3"
        >
          <NavDropdown.Item as={Link} to="/products">
            <img src={EyeSolid} alt="See all products" className="icon" /> All products
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/products/add">
            <img src={SolidCircle} alt="Add a new product" className="icon" /> Add product
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/products/my">
            <img src={SolidList} alt="List of all my products" className="icon" /> My products
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown
          title={
            <span>
              <img src={AccountGear} alt="Account" className="icon" /> Account
            </span>
          }
          className="text-dark d-flex align-items-center p-3"
        >
          <NavDropdown.Item as={Link} to="/account">
            <img src={MyAccount} alt="My Account" className="icon" /> My Account
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/privacy">
            <img src={PrivacyIcon} alt="Privacy" className="icon" /> Privacy
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>

      {/* Logout button */}
      <div className="logout-button mt-auto p-3 border-top">
        <button className="btn btn-danger d-flex align-items-center w-100">
          <img src={Logout} alt="Logout bottom icon" className='icon' /> 
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


