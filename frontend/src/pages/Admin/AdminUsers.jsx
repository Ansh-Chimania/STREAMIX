import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiTrash2 } from 'react-icons/fi';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBan = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/ban`);
      toast.success(data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="admin-page page-container">
      <div className="container">
        <h1 className="page-title">👥 Manage Users</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/movies" className="admin-nav-link">Movies</Link>
          <Link to="/admin/users" className="admin-nav-link active">Users</Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={user.isBanned ? 'banned-row' : ''}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                  <td>
                    <span className={`status-badge ${user.isBanned ? 'banned' : 'active'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <div className="table-actions">
                        <button className="action-btn warn" onClick={() => handleBan(user._id)} title={user.isBanned ? 'Unban' : 'Ban'}>
                          <FiShield />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(user._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
