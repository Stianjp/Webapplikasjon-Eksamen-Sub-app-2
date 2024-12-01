import React, { useEffect, useState } from 'react'
import "../styles/Account.css"
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]); // Save the list of users
  const [loading, setLoading] = useState(true); // handling loading state
  const [error, setError] = useState(null); // handling error state

  // Function for fetching users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
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
      // Update list of users after deleting the user
      setUsers(users.filter((user) => user.userId !== userId));
      console.log(`User with ID ${userId} deleted successfully.`);
    } catch (err) {
      console.error('Error deleting user:', err.response?.data || err.message);
    }
  };

  // If there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If the data is still loading
  if (loading) {
    return <div>Loading users...</div>;
  }

  // Render the list of users
  return (
    <div className='account-container'>
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
