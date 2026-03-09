import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import API from '../../api/axios';
import MovieForm from './MovieForm';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './Admin.css';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const { data } = await API.get('/movies');
      setMovies(data.results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await API.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      fetchMovies();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingMovie(null);
    fetchMovies();
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="admin-page page-container">
      <div className="container">
        <h1 className="page-title">🎬 Manage Movies</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/movies" className="admin-nav-link active">Movies</Link>
          <Link to="/admin/users" className="admin-nav-link">Users</Link>
        </div>

        <button className="add-movie-btn" onClick={() => { setEditingMovie(null); setShowForm(true); }}>
          <FiPlus /> Add Movie
        </button>

        {showForm && (
          <MovieForm movie={editingMovie} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingMovie(null); }} />
        )}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Release Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie._id}>
                  <td>{movie.title}</td>
                  <td><span className="role-badge">{movie.category}</span></td>
                  <td>{movie.rating?.toFixed(1) || 'N/A'}</td>
                  <td>{movie.releaseDate || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn edit" onClick={() => { setEditingMovie(movie); setShowForm(true); }}>
                        <FiEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(movie._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>No custom movies yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMovies;
