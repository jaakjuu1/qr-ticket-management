const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('basic', 'device_manager', 'admin'),
    defaultValue: 'basic'
  }
});

module.exports = User;