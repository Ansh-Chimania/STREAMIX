import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import TrailerModal from './components/TrailerModal/TrailerModal';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home/Home';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Explore from './pages/Explore/Explore';
import SearchResults from './pages/Search/SearchResults';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Favorites from './pages/Favorites/Favorites';
import WatchHistory from './pages/WatchHistory/WatchHistory';
import People from './pages/People/People';
import PersonDetail from './pages/PersonDetail/PersonDetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminMovies from './pages/Admin/AdminMovies';
import AdminUsers from './pages/Admin/AdminUsers';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  const { theme } = useSelector(state => state.ui);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Navbar />
      <TrailerModal />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/:type/:id" element={<MovieDetail />} />
        <Route path="/explore/:type" element={<Explore />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/people" element={<People />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/favorites" element={
          <ProtectedRoute><Favorites /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><WatchHistory /></ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/movies" element={
          <AdminRoute><AdminMovies /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
