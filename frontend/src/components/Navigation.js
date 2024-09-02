import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navigation = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  let userRole = null;
  if (isAuthenticated) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
        <li><Link to="/purchase-ticket" className="hover:text-blue-200">Purchase Ticket</Link></li>
        {!isAuthenticated && (
          <>
            <li><Link to="/login" className="hover:text-blue-200">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-200">Register</Link></li>
          </>
        )}
        {isAuthenticated && (
          <>
            {(userRole === 'device_manager' || userRole === 'admin') && (
              <li><Link to="/device-manager" className="hover:text-blue-200">Device Manager</Link></li>
            )}
            {userRole === 'admin' && (
              <li><Link to="/admin" className="hover:text-blue-200">Admin Panel</Link></li>
            )}
            <li><button onClick={handleLogout} className="hover:text-blue-200">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;