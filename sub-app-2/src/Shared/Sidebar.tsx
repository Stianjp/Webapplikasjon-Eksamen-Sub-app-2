import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoGreen from '../icons/LogoGreen.svg'; // Sørg for at denne banen er riktig
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="d-flex flex-column vh-100 bg-light shadow" style={{ width: '250px' }}>
      <div className="p-3 text-center border-bottom">
        <img src={LogoGreen} alt="Logo" className="mb-3" style={{ width: '50px' }} />
        <h1 className="h5 mb-0">FoodBank</h1>
      </div>
      <Nav className="flex-column nav-pills mt-3">
        <Nav.Link href="/home" className="text-dark d-flex align-items-center p-3">
          <i className="bi bi-house-door-fill me-2"></i> Home
        </Nav.Link>
        <NavDropdown title="Products" className="text-dark d-flex align-items-center p-3">
          <NavDropdown.Item href="#action/3.1">All products</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.2">Add product</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">My products</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="Account" className="text-dark d-flex align-items-center p-3">
          <NavDropdown.Item href="#action/3.4">My Account</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.5">Privacy</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
};

export default Sidebar;
