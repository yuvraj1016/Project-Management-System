import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ Auth, ProfAuth }) {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-content">
        <Link to="/" className="nav-logo">Project Management System</Link>
        <ul className="nav-links">
          {!Auth && !ProfAuth && (
            <>
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Signup</Link></li>
            </>
          )}
          {Auth && (
            <li><Link to="/user" className={location.pathname === '/user' ? 'active' : ''}>User Dashboard</Link></li>
          )}
          {ProfAuth && (
            <li><Link to="/prof" className={location.pathname === '/prof' ? 'active' : ''}>Prof Dashboard</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;

