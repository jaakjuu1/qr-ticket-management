const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Ticket, User, Device } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Purchase a ticket
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { deviceId } = req.body;
    const userId = req.user.userId;

    const ticket = await Ticket.create({
      qrCode: uuidv4(),
      UserId: userId,
      DeviceId: deviceId,
    });

    res.status(201).json({ message: 'Ticket purchased successfully', ticket });
  } catch (error) {
    res.status(400).json({ error: 'Ticket purchase failed', details: error.message });
  }
});

// Get user's tickets
router.get('/my-tickets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const tickets = await Ticket.findAll({
      where: { UserId: userId },
      include: [{ model: Device, attributes: ['name', 'location'] }],
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
  }
});

// Validate a ticket (for device managers)
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'device_manager' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { qrCode } = req.body;
    const ticket = await Ticket.findOne({ where: { qrCode } });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status !== 'active') {
      return res.status(400).json({ error: 'Ticket is not active' });
    }

    ticket.status = 'used';
    await ticket.save();

    res.json({ message: 'Ticket validated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Ticket validation failed', details: error.message });
  }
});

module.exports = router;