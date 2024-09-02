import React, { useState, useEffect } from 'react';
import { getMyTickets, purchaseTicket } from '../services/api';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getMyTickets();
      setTickets(response.data);
    } catch (err) {
      setError('Failed to fetch tickets');
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await purchaseTicket(deviceId);
      fetchTickets();
      setDeviceId('');
    } catch (err) {
      setError('Failed to purchase ticket');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Purchase Ticket</h3>
        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label className="block mb-1">Device ID:</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Purchase Ticket</button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">My Tickets</h3>
        <ul className="space-y-2">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="bg-white p-4 rounded shadow">
              <img src={`${ticket.qrCode}`} alt="QR Code" />
              <p>Status: <span className={`font-semibold ${ticket.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{ticket.status}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;