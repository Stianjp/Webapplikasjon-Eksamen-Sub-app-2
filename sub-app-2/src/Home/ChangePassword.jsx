import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:7067/api/Account';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    const { currentPassword, newPassword, confirmPassword } = formData;
    const errorMessages = [];

    if (!currentPassword.trim()) errorMessages.push('Current password is required.');
    if (!newPassword.trim()) errorMessages.push('New password is required.');
    if (newPassword !== confirmPassword) errorMessages.push('Passwords do not match.');

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
      const token = localStorage.getItem('authToken'); // <-- Ensure token is retrieved
      if (!token) {
        setErrors(['You are not logged in. Please log in and try again.']); // <-- Error if no token
        return;
      }

      const response = await fetch(`${API_BASE_URL}/changepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // <-- Include Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // <-- Safely parse response
        const errorMessage = errorData?.message || 'Failed to change password.';
        throw new Error(errorMessage);
      }

      const successData = await response.json().catch(() => ({ message: 'Password changed successfully.' }));
      setSuccessMessage(successData.message);
      setErrors([]);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setErrors([error.message]); // <-- Set backend error messages
    }
  };

  return (
    <Container>
      <Card className="p-4">
        <h2 className="mb-4">Change Password</h2>
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
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Change Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ChangePassword;
