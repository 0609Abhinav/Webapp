// const { Sequelize } = require('sequelize');

// // Replace 'your_root_password' with your actual MySQL root password
// const sequelize = new Sequelize('user_form_db', 'root', '123456789', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// module.exports = sequelize;
const { Sequelize } = require('sequelize');

// Replace 'your_root_password' with your actual MySQL root password
const sequelize = new Sequelize('user_form_db', 'root', '123456789', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable query logging
});

module.exports = sequelize;