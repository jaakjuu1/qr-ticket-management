require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv');
// dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', jwtSecret);




const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed', details: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password }); // Debug log

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found'); // Debug log
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password'); // Debug log
      return res.status(401).json({ error: 'Authentication failed' });
    }

    if (!process.env.JWT_SECRET) {
			console.log('JWT_SECRET is not defined', process.env); // Debug log
      console.error('JWT_SECRET is not defined'); // Debug log
      return res.status(500).json({ error: 'Internal server error' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    console.error('Login error:', error); // Debug log
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

module.exports = router;