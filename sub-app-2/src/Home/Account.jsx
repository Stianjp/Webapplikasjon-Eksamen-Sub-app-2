  import React, { useState, useEffect } from 'react';
  import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
  import { useNavigate } from 'react-router-dom';
  import { jwtDecode } from 'jwt-decode'; 
  import '../styles/Account.css';

  const API_BASE_URL = 'http://localhost:7067/api/Account';

  const Account = ({ onLogin }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [loginFormData, setLoginFormData] = useState({
      username: '',
      password: '',
    });

    const [registerFormData, setRegisterFormData] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      role: 'RegularUser', // Changed from accountType to role
    });

    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check if the user is authenticated by checking the auth token in localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userName = decodedToken['name'] || ''; // Extract username
          setLoginFormData((prevData) => ({
            ...prevData,
            username: userName, // Populate the username field
          }));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }, []);

    // Handle input changes for login form
    const handleLoginInputChange = (e) => {
      const { name, value } = e.target;
      setLoginFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Handle input changes for registration form
    const handleRegisterInputChange = (e) => {
      const { name, value } = e.target;
      setRegisterFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Validate login form
    const validateLoginForm = () => {
      const { username, password } = loginFormData;
      const errorMessages = [];

      if (!username.trim()) errorMessages.push('Username is required.');
      if (!password) errorMessages.push('Password is required.');

      return errorMessages;
    };

    // Validate registration form
    const validateRegisterForm = () => {
      const { username, password, confirmPassword } = registerFormData;
      const errorMessages = [];

      if (!username.trim()) errorMessages.push('Username is required.');
      if (password.length < 8)
        errorMessages.push('Password must be at least 8 characters long.');
      if (!/[A-Z]/.test(password))
        errorMessages.push('Password must contain at least one uppercase letter.');
      if (!/[a-z]/.test(password))
        errorMessages.push('Password must contain at least one lowercase letter.');
      if (password !== confirmPassword)
        errorMessages.push('Passwords do not match.');

      return errorMessages;
    };

    // Handle login form submission
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      const errors = validateLoginForm();

      if (errors.length > 0) {
        setErrors(errors);
        setSuccessMessage('');
        return;
      }

      try {
        // Login API Call
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(loginFormData),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Login failed.');
        }

        const loginData = await loginResponse.json();
        localStorage.setItem('authToken', loginData.token); // Save the token
        if (onLogin) onLogin(loginData); // Call parent login handler
        setSuccessMessage('Login successful!');
        setErrors([]);
        navigate('/'); // Redirect to index
      } catch (error) {
        setErrors([error.message]);
        // Clear password fields on failure
        setLoginFormData({
          ...loginFormData,
          password: '',
        });
      }
    };

    // Handle registration form submission
    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
      const errors = validateRegisterForm();

      if (errors.length > 0) {
        setErrors(errors);
        setSuccessMessage('');
        return;
      }

      try {
        // Registration API Call
        const registerResponse = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(registerFormData), // Include role in the request body
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
          credentials: 'include',
          body: JSON.stringify({
              username: registerFormData.username,
              password: registerFormData.password,
          }),
      });
      
      if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Auto-login failed.');
      }
      
      const loginData = await loginResponse.json();
      localStorage.setItem('authToken', loginData.token); // Save the token
        if (onLogin) onLogin(loginData); // Call parent login handler
        setSuccessMessage('Registration and login successful!');
        setErrors([]);
        navigate('/'); // Redirect to the index
      } catch (error) {
        setErrors([error.message]);
        // Clear password fields on failure
        setRegisterFormData({
          ...registerFormData,
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
      {errors.length > 0 && (
        <Alert variant="danger">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {isAuthenticated ? (
            <Row>
              <Col className="loggedin-container">
                {/* Content for authenticated users */}
                <h2 className="mb-3">Welcome!</h2>
                <p>You are currently logged in.</p>

                {/* Go to Dashboard Button */}
                <Button
                  className="mb-3"
                  variant="primary"
                  onClick={() => navigate('/')}
                >
                  Go to Dashboard
                </Button>

                <Card className="p-3 mb-3">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={loginFormData.username}
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value="********"
                        disabled
                      />
                    </Form.Group>
                  </Form>
                </Card>

                {/* Buttons Positioned on Opposite Sides */}
                <div className="d-flex justify-content-between mb-3">
                  <Button
                    variant="warning"
                    onClick={() => navigate('/change-password')}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => navigate('/delete-account')}
                  >
                    Delete Account
                  </Button>
                </div>
                  {/* Highlighted Changes End */}
              </Col>
            </Row>
      ) : (
            <Row>
              {/* Login Form */}
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h2 className="card-title mb-4 text-center">Login</h2>
                    <Form onSubmit={handleLoginSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={loginFormData.username}
                          onChange={handleLoginInputChange}
                          placeholder="Enter your username"
                          required
                        />
                      </Form.Group>
  
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={loginFormData.password}
                          onChange={handleLoginInputChange}
                          placeholder="Enter your password"
                          required
                        />
                      </Form.Group>
  
                      <Button variant="primary" type="submit" className="w-100">
                        Login
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
  
              {/* Registration Form */}
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h2 className="card-title mb-4 text-center">Register</h2>
                    <Form onSubmit={handleRegisterSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={registerFormData.username}
                          onChange={handleRegisterInputChange}
                          placeholder="Choose a username"
                          required
                        />
                      </Form.Group>
  
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={registerFormData.password}
                          onChange={handleRegisterInputChange}
                          placeholder="Choose a password"
                          required
                        />
                      </Form.Group>
  
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={registerFormData.confirmPassword}
                          onChange={handleRegisterInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </Form.Group>
  
                      <Form.Group className="mb-3">
                        <Form.Label>Account Type</Form.Label>
                        <Form.Select
                          name="role"
                          value={registerFormData.role}
                          onChange={handleRegisterInputChange}
                        >
                          <option value="RegularUser">Regular User</option>
                          <option value="FoodProducer">Food Producer</option>
                        </Form.Select>
                      </Form.Group>
  
                      <Button variant="success" type="submit" className="w-100">
                        Register
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    );
  };
  
  export default Account;