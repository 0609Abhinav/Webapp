
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    fromUserId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    toUserId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    messages: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    timestamp: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
  },
  {
    tableName: 'messages',
    timestamps: false,
  }
);

// Associations
Message.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });
Message.belongsTo(User, { foreignKey: 'toUserId', as: 'toUser' });

// Static methods
Message.createMessage = async ({ fromUserId, toUserId, messages }) => {
  const message = await Message.create({ fromUserId, toUserId, messages });
  return await Message.findByPk(message.id, {
    include: [
      { model: User, as: 'fromUser', attributes: ['id', 'fullName', 'email'] },
      { model: User, as: 'toUser', attributes: ['id', 'fullName', 'email'] },
    ],
  });
};

Message.findChat = async (user1, user2) => {
  return await Message.findAll({
    where: {
      [Op.or]: [
        { fromUserId: user1, toUserId: user2 },
        { fromUserId: user2, toUserId: user1 },
      ],
    },
    include: [
      { model: User, as: 'fromUser', attributes: ['id', 'fullName', 'email'] },
      { model: User, as: 'toUser', attributes: ['id', 'fullName', 'email'] },
    ],
    order: [['timestamp', 'ASC']],
  });
};

module.exports = Message;
