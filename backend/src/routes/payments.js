const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const QRCode = require('qrcode');
const { Ticket, User } = require('../models');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  const { ticketType, email } = req.body;

  let price;
  let quantity;

  switch (ticketType) {
    case 'single':
      price = 1000; // $10.00
      quantity = 1;
      break;
    case 'bundle':
      price = 9000; // $90.00
      quantity = 10;
      break;
    case 'wristband':
      price = 5000; // $50.00
      quantity = 1;
      break;
    default:
      return res.status(400).json({ error: 'Invalid ticket type' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Ticket`,
            },
            unit_amount: price,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      customer_email: email,
      metadata: {
        ticketType,
        email,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payment-success', async (req, res) => {
  const { session_id } = req.body;
  console.log('Received session_id:', session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Retrieved session:', session);

    const email = session.customer_email;
    const ticketType = session.metadata.ticketType;
    console.log('Customer email:', email);
    console.log('Ticket type:', ticketType);

    // Check if user exists, if not create a new user
    let user = await User.findOne({ where: { username: email } });
    let isNewUser = false;
    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Generate random password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        username: email,
        password: hashedPassword,
        role: 'basic'
      });
      console.log('Created new user:', user);
      isNewUser = true;
      // TODO: Send email to user with their new account details
    } else {
      console.log('User already exists:', user);
    }

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    let ticketCount;
    let expirationDate;

    switch (ticketType) {
      case 'single':
        ticketCount = 1;
        expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        break;
      case 'bundle':
        ticketCount = 10;
        expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now
        break;
      case 'wristband':
        ticketCount = 1;
        expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
        break;
    }

    const tickets = [];

    for (let i = 0; i < ticketCount; i++) {
      const qrCode = await QRCode.toDataURL(JSON.stringify({
        userId: user.id,
        ticketType,
        createdAt: new Date(),
      }));
      console.log('Generated QR code:', qrCode);

      console.log('Ticket:', Ticket);

      const ticket = await Ticket.create({
        UserId: user.id,
        qrCode,
        status: 'active',
        type: ticketType,
        expirationDate,
      });
      console.log('Created ticket:', ticket);

      tickets.push(ticket);
    }

    res.json({ 
      success: true, 
      tickets, 
      newUser: isNewUser,
      token: token,
      userId: user.id,
      role: user.role
    });
  } catch (error) {
    console.error('Error in /payment-success:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;