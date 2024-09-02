const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Ticket = sequelize.define('Ticket', {
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired'),
    defaultValue: 'active'
  },
  type: {
    type: DataTypes.ENUM('single', 'bundle', 'wristband'),
    allowNull: false
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Ticket;