import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-cine">STREAM</span>
            <span className="logo-verse">IX</span>
          </Link>
          <p className="footer-desc">
            Your ultimate destination for movies and TV shows. Discover, explore, and enjoy.
          </p>
          <div className="footer-socials">
            <a href="#"><FiGithub /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiInstagram /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Browse</h4>
          <Link to="/explore/movie">Movies</Link>
          <Link to="/explore/tv">TV Shows</Link>
          <Link to="/people">People</Link>
        </div>

        <div className="footer-links-group">
          <h4>Account</h4>
          <Link to="/favorites">Favorites</Link>
          <Link to="/history">Watch History</Link>
          <Link to="/login">Sign In</Link>
        </div>

        <div className="footer-links-group">
          <h4>Info</h4>
          <p className="footer-note">Powered by TMDB API</p>
          <p className="footer-note">Built with React & Node.js</p>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} Streamix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
