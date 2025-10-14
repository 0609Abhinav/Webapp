const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const State = require("./State"); // Optional if you have states

const Record = sequelize.define(
  "Record",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_Name: { type: DataTypes.STRING(255), allowNull: false },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Ensure unique constraint
      validate: {
        isEmail: true, // Validate email format
      },
    },
    phone: { type: DataTypes.CHAR(10), allowNull: true },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    dob: { type: DataTypes.DATEONLY, allowNull: true },
    stateId: { type: DataTypes.INTEGER, allowNull: true },
    state_name: { type: DataTypes.STRING(100), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    photo: { type: DataTypes.BLOB("long"), allowNull: true }, // Changed to BLOB
    pincode: { type: DataTypes.CHAR(6), allowNull: true },
    is_created: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_updated: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true }, // Added for schema consistency
  },
  {
    tableName: "users_record",
    timestamps: false, // Disable Sequelize default timestamps
  }
);

// Association with State (optional)
Record.belongsTo(State, { foreignKey: "stateId", as: "state" });

module.exports = Record;