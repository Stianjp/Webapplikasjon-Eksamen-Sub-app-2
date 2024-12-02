import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:7067/api/Account';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setErrors(['Password is required to delete the account.']);
      setSuccessMessage('');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // <-- Ensure token is retrieved
      if (!token) {
        setErrors(['You are not logged in. Please log in and try again.']); // <-- Error if no token
        return;
      }

      const response = await fetch(`${API_BASE_URL}/deleteaccount`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Include Authorization header
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // <-- Safely parse response
        const errorMessage = errorData?.message || 'Failed to delete account.';
        throw new Error(errorMessage);
      }

      const successData = await response.json().catch(() => ({ message: 'Account deleted successfully.' }));
      setSuccessMessage(successData.message);
      setErrors([]);
      setTimeout(() => {
        localStorage.removeItem('authToken');
        navigate('/account');
      }, 3000);
    } catch (error) {
      setErrors([error.message]); // <-- Set backend error messages
    }
  };

  return (
    <Container>
      <Card className="p-4">
        <h2 className="mb-4">Delete Account</h2>
        <p>To delete your account, please enter your password for confirmation.</p>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button variant="danger" type="submit">
            Delete Account
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default DeleteAccount;