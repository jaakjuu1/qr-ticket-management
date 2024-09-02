import React, { useState } from 'react';
import { validateTicket } from '../services/api';

function DeviceManager() {
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('');

  const handleValidate = async (e) => {
    e.preventDefault();
    try {
      await validateTicket(qrCode);
      setMessage('Ticket validated successfully');
      setQrCode('');
    } catch (error) {
      setMessage('Failed to validate ticket');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Device Manager</h2>
      <form onSubmit={handleValidate} className="space-y-4">
        <div>
          <label className="block mb-1">QR Code:</label>
          <input
            type="text"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            placeholder="Enter QR Code"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Validate Ticket</button>
      </form>
      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
}

export default DeviceManager;