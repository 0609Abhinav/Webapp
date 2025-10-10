
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const State = require('./State');
const bcrypt = require('bcrypt');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: true }, // Changed to allowNull: true
    password: { type: DataTypes.STRING, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: true }, // Changed to allowNull: true
    city: { type: DataTypes.STRING, allowNull: true }, // Changed to allowNull: true
    pincode: { type: DataTypes.STRING, allowNull: true }, // Changed to allowNull: true
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: true }, // Changed to ENUM and allowNull: true
    photo: { type: DataTypes.STRING, allowNull: true },
    stateId: { type: DataTypes.INTEGER, allowNull: true },
    state_name: { type: DataTypes.STRING, allowNull: true },

     // Added for password reset functionality
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.belongsTo(State, { foreignKey: 'stateId', as: 'state' });

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User; 