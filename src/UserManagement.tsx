import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', fullName: '', password:'' });
  const [editUser, setEditUser] = useState<any>(null);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/Users'); // Replace with your API endpoint
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5101/api/Users', newUser); // Replace with your API endpoint
      setNewUser({ username: '', fullName: '',password:'' });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    try {
      await axios.put(`/api/users/${editUser.id}`, editUser); // Replace with your API endpoint
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`); // Replace with your API endpoint
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* Add User Form */}
      <div>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* Edit User Form */}
      {editUser && (
        <div>
          <h3>Edit User</h3>
          <input
            type="text"
            placeholder="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <button onClick={handleEditUser}>Save Changes</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}

      {/* User List */}
      <div>
        <h3>User List</h3>
        <ul>
          {users.map((user: any) => (
            <li key={user.id}>
              <span>{user.name} ({user.username})</span>
              <button onClick={() => setEditUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
