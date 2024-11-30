import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Remove none admin-useres
import Tabell from './UserTable'; 
import UserEdit from './UserEdit'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';

const AdminUsers = () => {
  const navigate = useNavigate(); // Navigation hook
  const { user } = useUser(); // get userinfo from Context

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Beskytt siden basert på rolle
  useEffect(() => {
    if (user.role !== 'Admin') {
      alert('You are not authorized to view this page.');
      navigate('./Home/Home'); // Will navigate to the home-page
    }
  }, [user, navigate]);

  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Petter Northug', username: 'petternorthug', role: 'User' },
      { id: 2, name: 'Therese Johaug', username: 'theresejohaug', role: 'Foodproducer' },
      { id: 3, name: 'Admin', username: 'admin', role: 'Admin' },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  const handleSort = (key) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);

    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const lowerCaseTerm = term.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseTerm) ||
        user.username.toLowerCase().includes(lowerCaseTerm) ||
        user.role.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setSelectedUser(userToEdit);
  };

  const handleSave = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setSelectedUser(null); // Close edit-menu
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.filter((user) => user.id !== id)
      );
      setSelectedUser(null); 
    }
  };

  return (
    <Container>
      <h1 className="my-4">Admin: Manage Users</h1>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, username, or role"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Form.Group>

      <Tabell
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete} 
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {selectedUser && (
        <UserEdit
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => setSelectedUser(null)}
          onDelete={handleDelete} 
        />
      )}
    </Container>
  );
};

export default AdminUsers;
