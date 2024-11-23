import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div className="error-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="error-link">Go back to Home</Link>
    </div>
  );
}

export default Error;

