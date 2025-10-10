const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

// Protected routes
router.get('/', userController.getUsers);
router.get('/me', authenticate, userController.getCurrentUser);
router.get('/:id', authenticate, userController.getUserById); // <- GET user by ID
router.put('/me', authenticate, upload.single('photo'), userController.updateUser);
router.put('/:id', authenticate, upload.single('photo'), userController.updateUserById); // Admin/Protected update
router.delete('/:id', authenticate, userController.deleteUser);

// Public routes
router.post('/register', upload.single('photo'), userController.createUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;
