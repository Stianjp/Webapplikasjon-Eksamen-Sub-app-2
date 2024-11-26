/*Importerer*/
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavMenu.css';


/*Navbar*/
const NavMenu = () => {
    
    return(
        <div className="sidebar">
        <Navbar expand="lg" className="navbar-light bg-light">
        <Navbar.Brand as={Link} to="/" className="navbar-brand">FoodBank</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="menu flex-column nav-pills mb-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                
                <NavDropdown title="Products" id="products-dropdown">
                    <NavDropdown.Item as={Link} to="/Products">
                        All products
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/Products/add">
                        Add item
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/Products/my">
                        My products
                    </NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown title="Account" id="account-dropdown">
                    <NavDropdown.Item as={Link} to="/account">
                        My Account
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/privacy">
                        Privacy
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    </div>
  );
};

export default NavMenu;
