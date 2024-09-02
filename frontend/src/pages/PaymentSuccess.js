import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { confirmPayment } from '../services/api';

function PaymentSuccess() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      confirmPayment(sessionId)
        .then((response) => {
          setTickets(response.data.tickets);
          // Handle automatic login
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // You might want to update your app's state here to reflect the logged-in user
          }
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            history.push('/');
          }, 3000); // 3 seconds delay
        })
        .catch((error) => {
          setError('Failed to confirm payment. Please contact support.');
          console.error('Payment confirmation error:', error);
        });
    }
  }, [location, history]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payment Successful</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {tickets.length > 0 && (
        <div>
          <p className="mb-2">Your tickets:</p>
          <ul className="list-disc pl-5">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                Ticket ID: {ticket.id}, Type: {ticket.type}, Expires: {new Date(ticket.expirationDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <p className="mt-4">You will be redirected to your dashboard shortly...</p>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;