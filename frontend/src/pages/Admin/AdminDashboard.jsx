import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiFilm, FiHeart, FiAlertCircle } from 'react-icons/fi';
import API from '../../api/axios';
import Loader from '../../components/Loader/Loader';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="admin-page page-container">
      <div className="container">
        <h1 className="page-title">🛡️ Admin Dashboard</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link active">Dashboard</Link>
          <Link to="/admin/movies" className="admin-nav-link">Movies</Link>
          <Link to="/admin/users" className="admin-nav-link">Users</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FiUsers className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.totalUsers || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <FiFilm className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.totalMovies || 0}</h3>
              <p>Custom Movies</p>
            </div>
          </div>
          <div className="stat-card">
            <FiHeart className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.totalFavorites || 0}</h3>
              <p>Total Favorites</p>
            </div>
          </div>
          <div className="stat-card warn">
            <FiAlertCircle className="stat-icon" />
            <div className="stat-info">
              <h3>{stats?.bannedUsers || 0}</h3>
              <p>Banned Users</p>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Recent Users</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers?.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
