import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const authToken = localStorage.getItem('authToken');
  let userName = '';
  let roles = [];
  let roleMessage = '';

  if (authToken) {
    try {
      const decodedToken = jwtDecode(authToken);
      userName = decodedToken['name'] || '';
      roles = decodedToken['role'] || decodedToken['roles'];
      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      if (roles.includes('Administrator')) {
        roleMessage = 'As an administrator, you have full access to manage products and users.';
      } else if (roles.includes('FoodProducer')) {
        roleMessage = 'As a food producer, you can add and manage your products.';
      } else if (roles.includes('RegularUser')) {
        roleMessage = 'As a user, you can view all products and their nutritional information.';
      } else {
        roleMessage = 'Welcome to our application!';
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      userName = '';
      roles = [];
    }
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center">
          {authToken && userName ? (
            // Authenticated User Content
            <div className="welcome-container p-4 border rounded shadow-lg hover-shadow">
              <h2>Welcome, {userName}!</h2>
              <p className="lead text-muted">{roleMessage}</p>
              <hr />
              <p>Get started by exploring our products.</p>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/products">
                  <Button
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center justify-content-center"
                  >
                    View Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Unauthenticated User Content
            <div className="welcome-container p-4 border rounded shadow-lg hover-shadow">
              <h2>Welcome to FoodStack!</h2>
              <p className="lead text-muted">Discover a variety of food products and their nutritional information.</p>
              <hr />
              <p className="text-muted">You need to log in to access the full features of our application.</p>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/account">
                  <Button
                    variant="primary"
                    size="lg"
                    className="d-flex align-items-center justify-content-center"
                  >
                    Log in or register
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )}
  
export default Home;
