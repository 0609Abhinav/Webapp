const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const State = sequelize.define('State', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  state_name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'states',
  timestamps: false
});

module.exports = State;
