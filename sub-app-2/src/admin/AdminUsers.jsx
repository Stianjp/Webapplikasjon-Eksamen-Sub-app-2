import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import Tabell from './components/UserTable'; 
import UserEdit from './components/UserEdit'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Brukeren som redigeres

  // Mock data for brukere
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Petter Northug', username: 'petternorthug', role: 'User' },
      { id: 2, name: 'Therese Johaug', username: 'theresejohaug', role: 'Foodproducer' },
      { id: 3, name: 'Admin', username: 'admin', role: 'Admin' },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Sort
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

  // Søke-funksjon
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

  // Open edit
  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setSelectedUser(userToEdit);
  };

  // Save change
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

  // Delete a user
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
