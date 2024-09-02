import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Dashboard from './Dashboard';

function Home() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  let userRole = null;
  if (isAuthenticated) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to QR Ticket Manager</h1>
      <p className="mb-6">Manage your tickets efficiently with our QR-based system.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</Link>
        <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Register</Link>
      </div>
    </div>
  );
}

export default Home;