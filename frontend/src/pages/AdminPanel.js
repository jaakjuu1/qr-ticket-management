import React, { useState, useEffect } from 'react';
import { getAnalytics, getAllUsers, updateUserRole } from '../services/api';
import QRCodeGenerator from '../components/QRCodeGenerator';

function AdminPanel() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Failed to update user role', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {analytics && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p>Total Users: {analytics.totalUsers}</p>
          <p>Total Tickets: {analytics.totalTickets}</p>
          <p>Active Tickets: {analytics.activeTickets}</p>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">User Management</h3>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="bg-white p-4 rounded shadow">
            <span className="font-semibold">{user.username}</span> - Current Role: {user.role}
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="ml-4 px-2 py-1 border rounded"
            >
              <option value="basic">Basic</option>
              <option value="device_manager">Device Manager</option>
              <option value="admin">Admin</option>
            </select>
          </li>
        ))}
      </ul>
      
      <div className="mt-8">
        <QRCodeGenerator />
      </div>
    </div>
  );
}

export default AdminPanel;