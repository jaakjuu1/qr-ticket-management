const User = require('./User');
const Ticket = require('./Ticket');
const Device = require('./Device');

User.hasMany(Ticket);
Ticket.belongsTo(User);

Device.hasMany(Ticket);
Ticket.belongsTo(Device);

module.exports = {
  User,
  Ticket,
  Device
};