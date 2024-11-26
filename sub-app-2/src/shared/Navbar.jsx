/*Importerer*/
import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';


/*Navbar*/
const NavMenu = () => {
    return(
        <Navbar expand="lg">
            <Navbar.Brand class="navbar-brand" href="/Home">FoodBank</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="menu import flex-column nav-pills mb-auto">
                    <Nav.Link href="/Home">Home</Nav.Link>
                    <NavDropdown title="Products" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">All products</NavDropdown.Item>
                            <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.2">Add item</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">My products</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Account" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.4">My Account</NavDropdown.Item>
                            <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.2">Privacy</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
  );
};

export default NavMenu;
