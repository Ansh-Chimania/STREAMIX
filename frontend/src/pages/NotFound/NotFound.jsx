import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '8rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={{
        background: 'var(--accent-primary)',
        color: 'white',
        padding: '14px 32px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '1rem',
        transition: 'all 0.15s ease'
      }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
