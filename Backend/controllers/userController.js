const User = require('../models/User');
const State = require('../models/State');
const sequelize = require('../config/db');
const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const {
  SMTP_SERVER,
  SMTP_PORT,
  EMAIL_FROM,
  EMAIL_PASSWORD,
  FRONTEND_URL,
  JWT_SECRET = 'secret',
  JWT_EXPIRES_IN = '1h',
} = process.env;

if (!SMTP_SERVER || !SMTP_PORT || !EMAIL_FROM || !EMAIL_PASSWORD) {
  console.error('Missing email credentials: SMTP_SERVER, SMTP_PORT, EMAIL_FROM, EMAIL_PASSWORD must be set');
  process.exit(1);
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: Number(SMTP_PORT),
  secure: false,
  auth: { user: EMAIL_FROM, pass: EMAIL_PASSWORD },
  family: 4,
  connectionTimeout: 10000,
  logger: true,
  debug: true,
});

transporter.verify((err) => {
  if (err) console.error('SMTP config error:', err);
  else console.log('SMTP server ready');
});

// ------------------ User Registration ------------------
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, street, city, pincode, gender, stateId, state_name, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Full name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) return res.status(400).json({ status: 'error', message: 'Email already in use' });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const photo = req.file ? req.file.filename : null;

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      phone,
      street,
      city,
      pincode,
      gender,
      stateId,
      state_name,
      photo,
      password,
    });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ status: 'success', data: userData });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create user', error: err.message });
  }
};

// ------------------ User Login ------------------
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password are required' });

//     const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
//     const { password: _, ...userData } = user.toJSON();
//     res.status(200).json({ status: 'success', message: 'Login successful', data: userData, token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ status: 'error', message: 'Failed to login', error: err.message });
//   }
// };

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🧩 Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 🧩 Find user
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      console.warn(`⚠️ Login failed: No user found for ${normalizedEmail}`);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // 🧩 Compare passwords safely
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn(`⚠️ Login failed: Incorrect password for ${normalizedEmail}`);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // 🧩 Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 🧩 Prepare response
    const { password: _, resetPasswordToken, resetPasswordExpires, ...userData } = user.toJSON();

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: userData,
      token,
    });

  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to login',
      error: err.message,
    });
  }
};

// ------------------ Get Users ------------------
exports.getUsers = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const searchTerm = req.query.searchTerm || '';
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await sequelize.query(
      'CALL GetAllUsersData_V2(:pageNumber, :pageSize, :searchTerm, :sortField, :sortOrder)',
      {
        replacements: { pageNumber, pageSize, searchTerm, sortField, sortOrder },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    // Flatten result
    const users = result.flatMap(r => Object.values(r).filter(u => u && u.id));

    // Extract metadata
    const metadata = result.find(r => r.totalRecords && r.totalPages) || {};
    const totalUsers = metadata.totalRecords || users.length;
    const totalPages = metadata.totalPages || 1;

    res.status(200).json({ status: 'success', pageNumber, pageSize, totalUsers, totalPages, data: users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users', error: err.message });
  }
};

// ------------------ Get States ------------------
exports.getStates = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await sequelize.query('CALL get_states(:pageNumber, :pageSize)', {
      replacements: { pageNumber, pageSize },
      type: QueryTypes.SELECT,
      raw: true,
    });

    const states = Array.isArray(result) ? result.flat() : [];
    const countResult = await sequelize.query('SELECT COUNT(*) AS total FROM states', { type: QueryTypes.SELECT });
    const totalRecords = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({ status: 'success', pageNumber, pageSize, totalRecords, totalPages, data: states });
  } catch (err) {
    console.error('Get states error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch states', error: err.message });
  }
};

// ------------------ Combined Users + States ------------------
exports.getUsersAndStates = async (req, res) => {
  try {
    const userPageNumber = parseInt(req.query.userPageNumber) || 1;
    const userPageSize = parseInt(req.query.userPageSize) || 10;
    const searchTerm = req.query.searchTerm || '';
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const statePageNumber = parseInt(req.query.statePageNumber) || 0;
    const statePageSize = parseInt(req.query.statePageSize) || 100;

    const [usersResult, statesResult, statesCountResult] = await Promise.all([
      sequelize.query('CALL GetAllUsersData_V2(:pageNumber, :pageSize, :searchTerm, :sortField, :sortOrder)', {
        replacements: { pageNumber: userPageNumber, pageSize: userPageSize, searchTerm, sortField, sortOrder },
        type: QueryTypes.SELECT,
        raw: true,
      }),
      sequelize.query('CALL get_states(:pageNumber, :pageSize)', {
        replacements: { pageNumber: statePageNumber, pageSize: statePageSize },
        type: QueryTypes.SELECT,
        raw: true,
      }),
      sequelize.query('SELECT COUNT(*) AS total FROM states', { type: QueryTypes.SELECT }),
    ]);

    const users = usersResult.flatMap(r => Object.values(r).filter(u => u && u.id));
    const userMetadata = usersResult.find(r => r.totalRecords && r.totalPages) || {};
    const totalUsers = userMetadata.totalRecords || users.length;
    const totalUserPages = userMetadata.totalPages || 1;

    const states = statesResult.flat ? statesResult.flat() : statesResult;
    const totalStates = statesCountResult[0]?.total || 0;
    const totalStatePages = Math.ceil(totalStates / statePageSize);

    res.status(200).json({
      status: 'success',
      users: { pageNumber: userPageNumber, pageSize: userPageSize, totalUsers, totalPages: totalUserPages, data: users },
      states: { pageNumber: statePageNumber, pageSize: statePageSize, totalStates, totalPages: totalStatePages, data: states },
    });
  } catch (err) {
    console.error('Combined users and states error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users and states', error: err.message });
  }
};

// ------------------ Get Current User ------------------
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] }, include: [{ model: State, as: 'state' }] });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.json({ status: 'success', data: user });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch user', error: err.message });
  }
};

// ------------------ Update User ------------------
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, phone, street, city, pincode, gender, stateId, state_name } = req.body;
    if (!fullName || !email) return res.status(400).json({ status: 'error', message: 'Full name and email are required' });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });
      if (existingUser && existingUser.id !== req.user.id) return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    const photo = req.file ? req.file.filename : user.photo;
    await user.update({ fullName, email: normalizedEmail, phone, street, city, pincode, gender, stateId, state_name, photo });

    const { password: _, ...userData } = user.toJSON();
    res.status(200).json({ status: 'success', message: 'Profile updated successfully', data: userData });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update user', error: err.message });
  }
};

// ------------------ Forgot Password ------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) return res.status(404).json({ status: 'error', message: 'No user found with that email address' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.update({ resetPasswordToken, resetPasswordExpires });

    const resetUrl = `http://localhost:3000/#/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Link expires in 1 hour.</p>`,
    });

    res.status(200).json({ status: 'success', message: 'Password reset email sent successfully' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to process password reset request', error: err.message });
  }
};

// ------------------ Reset Password ------------------

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // token from URL
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Token and new password are required',
      });
    }

    // ✅ Hash token before lookup
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    // ✅ Find user with matching token and valid expiration
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }

    // ✅ Update password directly — model hook will hash it automatically
    await user.update({
      password, // plain text — Sequelize hook will hash it
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password',
      error: err.message,
    });
  }
};


// ------------------ Delete User ------------------
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!userId) return res.status(400).json({ status: 'error', message: 'User ID is required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    await user.destroy(); // Hard delete

    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete user', error: err.message });
  }
};
// ------------------ Update User by ID ------------------
// exports.updateUserById = async (req, res) => {
//   try {
//     const userId = parseInt(req.params.id);
//     if (!userId) return res.status(400).json({ status: 'error', message: 'User ID is required' });

//     const { fullName, email, phone, street, city, pincode, gender, stateId, state_name } = req.body;
//     if (!fullName || !email) return res.status(400).json({ status: 'error', message: 'Full name and email are required' });

//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

//     const normalizedEmail = email.toLowerCase().trim();
//     if (normalizedEmail !== user.email) {
//       const existingUser = await User.findOne({ where: { email: normalizedEmail } });
//       if (existingUser && existingUser.id !== userId) return res.status(400).json({ status: 'error', message: 'Email already in use' });
//     }

//     const photo = req.file ? req.file.filename : user.photo;
//     await user.update({ fullName, email: normalizedEmail, phone, street, city, pincode, gender, stateId, state_name, photo });

//     const { password: _, ...userData } = user.toJSON();
//     res.status(200).json({ status: 'success', message: 'User updated successfully', data: userData });
//   } catch (err) {
//     console.error('Update user by ID error:', err);
//     res.status(500).json({ status: 'error', message: 'Failed to update user', error: err.message });
//   }
// };
exports.updateUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!userId) return res.status(400).json({ status: 'error', message: 'User ID is required' });

    const { fullName, email, phone, street, city, pincode, gender, stateId, state_name } = req.body;
    if (!fullName || !email) return res.status(400).json({ status: 'error', message: 'Full name and email are required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== user.email) {
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });
      if (existingUser && existingUser.id !== userId) return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    const photo = req.file ? req.file.filename : user.photo;
    await user.update({ fullName, email: normalizedEmail, phone, street, city, pincode, gender, stateId, state_name, photo });

    // Fetch updated user with state included
    const updatedUser = await User.findByPk(userId, { 
      attributes: { exclude: ['password'] },
      include: [{ model: State, as: 'state' }]
    });

    res.status(200).json({ status: 'success', message: 'User updated successfully', data: updatedUser });
  } catch (err) {
    console.error('Update user by ID error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update user', error: err.message });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (!userId) return res.status(400).json({ status: 'error', message: 'User ID is required' });

    const user = await User.findByPk(userId, { 
      attributes: { exclude: ['password'] },
      include: [{ model: State, as: 'state' }] // <-- Include state
    });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch user', error: err.message });
  }
};