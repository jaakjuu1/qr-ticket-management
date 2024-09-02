const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

// Function to drop all data and rebuild the database
async function resetDatabase() {
  try {
    const [results, metadata] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='YourTableName';");
    if (results.length === 0) {
      await sequelize.sync({ force: true });
      console.log('Database has been reset and rebuilt.');
    } else {
      console.log('Database already exists. Skipping reset.');
    }
  } catch (error) {
    console.error('Error resetting the database:', error);
  }
}

// Call the resetDatabase function
// resetDatabase();

module.exports = sequelize;