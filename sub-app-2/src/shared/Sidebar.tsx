import React, { useState } from 'react';
import { Nav, Navbar, Collapse, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SolidList from '../icons/list-solid.svg';
import SolidCircle from '../icons/circle-plus-solid.svg';
import EyeSolid from '../icons/eye-solid.svg';
import BowlSolid from '../icons/bowl-food-solid.svg';
import Home from '../icons/house-solid.svg';
import LogoGreen from '../icons/LogoGreen.svg';
import AccountGear from '../icons/gear-solid.svg';
import MyAccount from '../icons/gauge-solid.svg';
import Logout from '../icons/right-to-bracket-solid.svg';
import { FaUsersCog } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false); // State for toggling the navbar on small screens

  return (
    <>
      {/* Navbar for small screens */}
      <Navbar bg="light" expand="lg" className="d-lg-none shadow">
        <div className="d-flex justify-content-between align-items-center w-100 p-3">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={LogoGreen} alt="Logo" className="me-2" style={{ width: '30px' }} />
            <span>FoodBank</span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setOpen(!open)}
            className="border-0"
          />
        </div>
        <Collapse in={open}>
        <div id="responsive-navbar-nav">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className="border-bottom">
              <img src={Home} alt="Home" className="icon" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="border-bottom ">
              <img src={SolidList} alt="Products" className="icon" /> All products
            </Nav.Link>
            <Nav.Link as={Link} to="/add" className='border-bottom p-2'>
              <img src={SolidCircle} alt="Create products" className='icon' /> Add a product
            </Nav.Link>
            <Nav.Link as={Link} to={"/my"} className='border-bottom p-2'>
              <img src={BowlSolid} alt="My products" className='icon' /> My products
            </Nav.Link>
            <Nav.Link as={Link} to="/account" className="border-bottom">
              <img src={AccountGear} alt="Account" className="icon" /> Account
            </Nav.Link>
            <Nav.Link as={Link} to="/privacy" className="border-bottom p-2">
              <img src={EyeSolid} alt="Privacy" className="icon" /> Privacy
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className='border-bottom p-2'><FaUsersCog className='icon' />
                Admin
            </Nav.Link>
            <Nav.Link as={Link} to="/logout" className="text-danger p-3">
              <img src={Logout} alt="Logout" className="icon" /> Logout
            </Nav.Link>
          </Nav>
          </div>
        </Collapse>
      </Navbar>

      {/* Sidebar for large screens */}
      <Navbar bg="light" expand="lg" className="vh-100 flex-column d-none d-lg-flex shadow">
        <Navbar.Brand as={Link} to="/" className="p-3 text-center border-bottom">
          <img src={LogoGreen} alt="Logo" className="mb-3" style={{ width: '50px' }} />
          <h1 className="h5 mb-0">FoodBank</h1>
        </Navbar.Brand>
        <Nav className="flex-column nav-pills mt-3">
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
                <img src={SolidList} alt="See all products" className="icon" /> All products
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/products/add">
                <img src={SolidCircle} alt="Add a new product" className="icon" /> Add product
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products/my">
                <img src={BowlSolid} alt="List of all my products" className="icon" /> My products
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
                <img src={EyeSolid} alt="Privacy" className="icon" /> Privacy
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/users"><FaUsersCog className='icon'></FaUsersCog>
                Admin</NavDropdown.Item>
            </NavDropdown>
          <div className="logout-button mt-auto p-3 border-top">
            <button className="btn btn-danger d-flex align-items-center w-100">
              <img src={Logout} alt="Logout" className="icon" /> Logout
            </button>
          </div>
        </Nav>
      </Navbar>
    </>
  );
};

export default Sidebar;
