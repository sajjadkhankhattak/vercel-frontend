import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUsers();
      
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (editingUser) {
        // Update existing user
        const response = await updateUser(editingUser._id, formData);
        if (response.data.success) {
          await fetchUsers(); // Refresh the list
          resetForm();
          alert('User updated successfully!');
        }
      } else {
        // Create new user
        const response = await createUser(formData);
        if (response.data.success) {
          await fetchUsers(); // Refresh the list
          resetForm();
          alert('User created successfully!');
        }
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '' // Don't pre-fill password for security
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await deleteUser(userId);
        if (response.data.success) {
          await fetchUsers(); // Refresh the list
          alert('User deleted successfully!');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    setEditingUser(null);
    setShowPassword(false);
    setError('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">User Management</h2>
        </div>
      </div>

      {/* Add/Edit User Form */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className={`card-header ${editingUser ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
              <h5 className="mb-0">
                {editingUser ? `Edit User: ${editingUser.firstName} ${editingUser.lastName}` : 'Add New User'}
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={editingUser} // Don't allow email changes when editing
                  />
                  {editingUser && (
                    <div className="form-text text-muted">
                      Email cannot be changed for existing users
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password * {!editingUser && '(min 6 characters)'}
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength="6"
                      placeholder={editingUser ? "Leave blank to keep current password" : ""}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {editingUser && (
                    <div className="form-text text-muted">
                      Leave password blank to keep current password
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success flex-fill">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  {editingUser && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Records</h5>
              <button 
                className="btn btn-light btn-sm" 
                onClick={fetchUsers}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">
                  {error}
                  <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchUsers}>
                    Retry
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <i className="bi bi-people" style={{fontSize: '2rem'}}></i>
                              <p className="mt-2">No users found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((user, index) => (
                          <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleEdit(user)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer text-muted d-flex justify-content-between align-items-center">
              <span>Total Users: {users.length}</span>
              <small>Last updated: {new Date().toLocaleTimeString()}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;