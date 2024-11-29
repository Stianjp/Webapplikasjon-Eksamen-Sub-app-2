import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
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
    <Container>
      {authToken && userName ? (
        <Card className="welcome-container">
          <Card.Body>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center mb-3">
                <Image 
                  src={`${process.env.PUBLIC_URL}/icons/bowl-food-solid.svg`} 
                  alt="App Logo" 
                  fluid 
                />
              </Col>
              <Col xs={12}>
                <Card.Title as="h2">Welcome, {userName}!</Card.Title>
                <Card.Subtitle as="h6" className="lead mb-3">{roleMessage}</Card.Subtitle>
                <hr className="my-4" />
                <Card.Text className="second-color">Get started by exploring our products.</Card.Text>
                <Button 
                  as={Link} 
                  to="/products" 
                  className="d-flex align-items-center"
                >
                  <Image 
                    src={`${process.env.PUBLIC_URL}/icons/arrow-right-solid.svg`} 
                    alt="Go to products" 
                    className="me-2" 
                  />
                  <span>View Products</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <Card className="welcome-container">
          <Card.Body>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center mb-3">
                <Image 
                  src={`${process.env.PUBLIC_URL}/icons/bowl-food-solid.svg`} 
                  alt="App Logo" 
                  fluid 
                />
              </Col>
              <Col xs={12}>
                <Card.Title as="h2">Welcome to FoodStack!</Card.Title>
                <Card.Subtitle as="h6" className="lead mb-3">
                  Discover a variety of food products and their nutritional information.
                </Card.Subtitle>
                <hr className="my-4" />
                <Card.Text className="second-color">
                  You need to log in to access the full features of our application.
                </Card.Text>
                <Button 
                  as={Link} 
                  to="/account" 
                  className="d-flex align-items-center"
                >
                  <Image 
                    src={`${process.env.PUBLIC_URL}/icons/arrow-right-solid.svg`} 
                    alt="Go to register form" 
                    className="me-2" 
                  />
                  <span>Log in or register</span>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Home;