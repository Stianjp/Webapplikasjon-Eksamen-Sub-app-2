import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Helper function to get user info from auth token
const getUserInfo = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const userName = decodedToken['name'] || '';
    const roles = Array.isArray(decodedToken['role']) ? decodedToken['role'] : [decodedToken['role']];

    return { userName, roles };
  } catch (error) {
    console.error('Error decoding token:', error);
    return { userName: '', roles: [] };
  }
};

const Home = () => {
  const authToken = localStorage.getItem('authToken');
  const { userName, roles } = authToken ? getUserInfo(authToken) : {};

  const roleMessages = {
    Administrator: 'As an administrator, you have full access to manage products and users.',
    FoodProducer: 'As a food producer, you can add and manage your products.',
    RegularUser: 'As a user, you can view all products and their nutritional information.',
  };

  const roleMessage = roles.length
    ? roles.map((role) => roleMessages[role] || 'Welcome to our application!').join(' ')
    : 'Welcome to our application!';

  return (
    <Container>
      <div className="welcome-container">
        <div className="jumbotron text-center">
          <img src="/icons/bowl-food-solid.svg" alt="App Logo" className="img-fluid mb-3 rounded" />
          <h2>Welcome, {userName || 'to FoodStack!'}</h2>
          <h6 className="lead">{roleMessage}</h6>
          <hr className="my-4" />
          <p className="second-color">{userName ? 'Get started by exploring our products.' : 'You need to log in to access the full features of our application.'}</p>
          <Link className="btn btn-primary icon" to={userName ? '/products' : '/account'} role="button">
            <img src="/icons/arrow-right-solid.svg" alt="Go to products" /> {userName ? 'View Products' : 'Log in or register'}
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Home;