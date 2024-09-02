import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/dashboard" className="text-blue-500 hover:text-blue-600">Return to Dashboard</Link>
    </div>
  );
}

export default Unauthorized;