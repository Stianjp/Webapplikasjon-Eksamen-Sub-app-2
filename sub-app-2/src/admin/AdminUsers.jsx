import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // Lagrer listen over brukere
  const [loading, setLoading] = useState(true); // Håndterer loading state
  const [error, setError] = useState(null); // Håndterer feil

  // Funksjon for å hente brukere fra API-et
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Token:', token); // Bekreft tokenet
      const response = await axios.get('http://localhost:7067/api/Admin/usermanager', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // The list of the users
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  
  const editRoles = (userId) => {
    console.log(`Edit roles for user with ID: ${userId}`);
    // This is where you would open a modal or navigate to a new page to edit roles
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:7067/api/Admin/deleteuser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Oppdater listen over brukere etter sletting
      setUsers(users.filter((user) => user.userId !== userId));
      console.log(`User with ID ${userId} deleted successfully.`);
    } catch (err) {
      console.error('Error deleting user:', err.response?.data || err.message);
    }
  };

  // Hvis det er en feil
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Hvis det laster
  if (loading) {
    return <div>Loading users...</div>;
  }

  // Render brukere i en tabell
  return (
    <div>
      <h1>Admin User Management</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.username}</td>
              <td>{user.roles.join(', ')}</td>
              <td>
                <button onClick={() => editRoles(user.userId)}>Edit Roles</button>
                <button onClick={() => deleteUser(user.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
