const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Device = sequelize.define('Device', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Device;