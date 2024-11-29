import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './Account.css';

const API_BASE_URL = 'http://localhost:7067/api/Account';

const Account = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    accountType: 'RegularUser', // Adjust based on your backend roles
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, password, confirmPassword } = formData;
    const errorMessages = [];

    if (!username.trim()) errorMessages.push('Username is required.');
    if (password.length < 8)
      errorMessages.push('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(password))
      errorMessages.push('Password must contain at least one uppercase letter.');
    if (!/[a-z]/.test(password))
      errorMessages.push('Password must contain at least one lowercase letter.');
    if (isRegister && password !== confirmPassword)
      errorMessages.push('Passwords do not match.');

    return errorMessages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setErrors(errors);
      setSuccessMessage('');
      return;
    }

    try {
      if (isRegister) {
        // Registration API Call
        const registerResponse = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.accountType,
          }),
        });

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          throw new Error(errorData.message || 'Registration failed.');
        }

        // Automatically log the user in after registration
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Auto-login failed.');
        }

        const loginData = await loginResponse.json();
        localStorage.setItem('authToken', loginData.token); // Save the token
        if (onLogin) onLogin(loginData); // Call parent login handler if provided
        setSuccessMessage('Registration and login successful!');
      } else {
        // Login API Call
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Login failed.');
        }

        const loginData = await loginResponse.json();
        localStorage.setItem('authToken', loginData.token); // Save the token
        if (onLogin) onLogin(loginData); // Call parent login handler if provided
        setSuccessMessage('Login successful!');
      }

      // Clear errors on success
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);

      // Clear password fields on failure
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    }
  };

  useEffect(() => {
    setErrors([]);
    setSuccessMessage('');
  }, []);

  return (
    <Container>
      <div className="account-container">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {errors.length > 0 && (
          <Alert variant="danger">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </Alert>
        )}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          {isRegister && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account Type</Form.Label>
                <Form.Select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                >
                  <option value="RegularUser">Regular User</option>
                  <option value="FoodProducer">Food Producer</option>
                </Form.Select>
              </Form.Group>
            </>
          )}

          <Button variant={isRegister ? 'success' : 'primary'} type="submit">
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </Form>

        <p className="toggle-link">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setErrors([]);
              setSuccessMessage('');
              setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                accountType: 'RegularUser',
              });
            }}
            className="link-text"
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </Container>
  );
};

export default Account;
