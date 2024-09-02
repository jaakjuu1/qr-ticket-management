import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { purchaseTicket } from '../services/api';
require('dotenv').config({ path: '../.env' });

console.log('process.env.STRIPE_PUBLISHABLE_KEY', process.env);
const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

function TicketPurchase() {
  const [ticketType, setTicketType] = useState('single');
  const [email, setEmail] = useState('');

  const handlePurchase = async () => {
    try {
      const response = await purchaseTicket(ticketType, email);
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Purchase Tickets</h2>
      <div className="mb-4">
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Ticket Type:</label>
        <select
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="single">Single Ticket ($10)</option>
          <option value="bundle">Bundle of 10 Tickets ($90)</option>
          <option value="wristband">Day Pass Wristband ($50)</option>
        </select>
      </div>
      <button
        onClick={handlePurchase}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Purchase
      </button>
    </div>
  );
}

export default TicketPurchase;