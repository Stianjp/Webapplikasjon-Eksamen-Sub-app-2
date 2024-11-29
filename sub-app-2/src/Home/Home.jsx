import React from 'react';
import { Container } from 'react-bootstrap';
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
        // Extract username
        userName = decodedToken['name'] || '';
        // Extract roles
        roles = decodedToken['role'] || decodedToken['roles'];
        // Ensure roles is an array
        if (!Array.isArray(roles)) {
            roles = [roles];
        }

      // Determine role-specific message
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
      // If there's an error decoding the token, treat the user as unauthenticated
      userName = '';
      roles = [];
    }
  }

  return (
    <Container>
      {authToken && userName ? (
        // Authenticated User Content
        <div className="welcome-container">
          <div className="jumbotron">
            <div className="text-center mb-3 rounded">
              <img src="/icons/bowl-food-solid.svg" alt="App Logo" className="img-fluid" />
            </div>
            <h2>Welcome, {userName}!</h2>
            <h6 className="lead">{roleMessage}</h6>
            <hr className="my-4" />
            <p className="second-color">Get started by exploring our products.</p>
            <Link className="btn btn-primary icon" to="/products" role="button">
              <img src="/icons/arrow-right-solid.svg" alt="Go to products" /> View Products
            </Link>
          </div>
        </div>
      ) : (
        // Unauthenticated User Content
        <div className="welcome-container">
          <div className="jumbotron">
            <div className="text-center mb-3 rounded">
              <img src="/icons/bowl-food-solid.svg" alt="App Logo" className="img-fluid" />
            </div>
            <h2>Welcome to FoodStack!</h2>
            <h6 className="lead">Discover a variety of food products and their nutritional information.</h6>
            <hr className="my-4" />
            <p className="second-color">You need to log in to access the full features of our application.</p>
            <Link className="btn btn-primary icon" to="/account" role="button">
              <img src="/icons/arrow-right-solid.svg" alt="Go to register form" /> Log in or register
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;
