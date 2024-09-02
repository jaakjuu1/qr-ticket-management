import React, { useState } from 'react';
import { generateQRCode } from '../services/api';

function QRCodeGenerator() {
  const [qrCode, setQRCode] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateQR = async () => {
    try {
      const response = await generateQRCode();
      setQRCode(response.data.qrCodeDataUrl);
      setError('');
    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Ticket Purchase QR Code</h2>
      <button
        onClick={handleGenerateQR}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
      >
        Generate QR Code
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {qrCode && (
        <div className="mt-4">
          <img src={qrCode} alt="QR Code for Ticket Purchase" className="mx-auto" />
          <p className="text-center mt-2">Scan this QR code to access the ticket purchase page</p>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;