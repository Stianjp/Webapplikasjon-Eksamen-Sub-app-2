import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const UserEdit = ({ user, onSave, onCancel, onDelete }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [newPassword, setNewPassword] = useState(''); // New password
  const [adminPassword, setAdminPassword] = useState(''); // Admin-password
  const [showAdminPasswordField, setShowAdminPasswordField] = useState(user.role === 'Admin'); // If the admin password gonna show, you need to select admin-role
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setEditedUser({ ...editedUser, role: newRole });
    setShowAdminPasswordField(newRole === 'Admin'); 
  };

  const handleSave = () => {
    if (editedUser.role === 'Admin' && adminPassword !== 'admin') {
      setErrorMessage('Incorrect admin password. Cannot assign Admin role.');
      return;
    }

    const updatedUser = { ...editedUser, password: newPassword || user.password };
    onSave(updatedUser);
    setNewPassword('');
    setAdminPassword('');
    setErrorMessage('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDelete(user.id);
    }
  };

  return (
    <Modal show={true} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={editedUser.username}
              onChange={(e) =>
                setEditedUser({ ...editedUser, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={editedUser.role}
              onChange={handleRoleChange}
            >
              <option value="User">User</option>
              <option value="Foodproducer">Foodproducer</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
          {showAdminPasswordField && (
            <Form.Group className="mb-3">
              <Form.Label>Admin Password</Form.Label>
              <Form.Control
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
              />
              <Form.Text className="text-danger">
                {errorMessage}
              </Form.Text>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <Form.Text className="text-muted">
              Leave blank if you don't want to change the password.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          Delete User
        </Button>
        <div className="ms-auto">
          <Button variant="secondary" onClick={onCancel} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UserEdit;
