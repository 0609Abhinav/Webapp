const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getStates = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber, 10) || 0; // default 0
    const pageSize = parseInt(req.query.pageSize, 10) || 10;    // default 10

    const states = await sequelize.query(
      'CALL get_states(:pageNumber, :pageSize)',
      { replacements: { pageNumber, pageSize }, type: QueryTypes.RAW }
    );

    const normalizedStates = Array.isArray(states[0]) ? states[0] : states;

    res.status(200).json({
      pageNumber,
      pageSize,
      states: normalizedStates,
      count: normalizedStates.length
    });
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    res.status(500).json({ message: 'Failed to fetch states', error: error.message });
  }
};
