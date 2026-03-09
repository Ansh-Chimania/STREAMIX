import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiUser, FiHeart, FiClock, FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiShield } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowMobileNav(false);
    setShowMenu(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-cine">CINE</span>
          <span className="logo-verse">VERSE</span>
        </Link>

        <div className={`navbar-links ${showMobileNav ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/explore/movie" className={`nav-link ${isActive('/explore/movie') ? 'active' : ''}`}>Movies</Link>
          <Link to="/explore/tv" className={`nav-link ${isActive('/explore/tv') ? 'active' : ''}`}>TV Shows</Link>
          <Link to="/people" className={`nav-link ${isActive('/people') ? 'active' : ''}`}>People</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/search" className="nav-icon-btn" title="Search">
            <FiSearch />
          </Link>

          <button className="nav-icon-btn" onClick={() => dispatch(toggleTheme())} title="Toggle Theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="user-avatar-btn" onClick={() => setShowMenu(!showMenu)}>
                <div className="avatar-circle">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>

              {showMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="avatar-circle large">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/favorites" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    <FiHeart /> Favorites
                  </Link>
                  <Link to="/history" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    <FiClock /> Watch History
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowMenu(false)}>
                      <FiShield /> Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-signin">Sign In</Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setShowMobileNav(!showMobileNav)}>
            {showMobileNav ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
