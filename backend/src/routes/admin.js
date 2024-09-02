const express = require('express');
const { User, Ticket, Device } = require('../models');
const authMiddleware = require('../middleware/auth');
const QRCode = require('qrcode');

const router = express.Router();

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Update user role
router.patch('/users/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role', details: error.message });
  }
});

// Get analytics data
router.get('/analytics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTickets = await Ticket.count();
    const activeTickets = await Ticket.count({ where: { status: 'active' } });
    const usedTickets = await Ticket.count({ where: { status: 'used' } });
    const totalDevices = await Device.count();

    const analytics = {
      totalUsers,
      totalTickets,
      activeTickets,
      usedTickets,
      totalDevices,
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
});

// New route for generating QR code
router.post('/generate-qr', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  try {
    const purchasePageUrl = `${process.env.FRONTEND_URL}/purchase-ticket`;
    const qrCodeDataUrl = await QRCode.toDataURL(purchasePageUrl);
    res.json({ qrCodeDataUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

module.exports = router;