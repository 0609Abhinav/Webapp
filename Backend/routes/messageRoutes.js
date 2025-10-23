// const express = require('express');
// const router = express.Router();
// const messageController = require('../controllers/messageController');
// const multer = require('multer');
// const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // ---------------- CLOUDINARY CONFIG ----------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
//   api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
//   api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
// });

// // ---------------- MULTER STORAGE CONFIG ----------------
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'chat_uploads',
//     resource_type: 'auto',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'docx', 'xlsx'],
//     transformation: [{ quality: 'auto', fetch_format: 'auto' }],
//   },
// });

// const upload = multer({ storage });

// // ---------------- ROUTES ----------------

// // GET all chat messages between two users
// router.get('/', messageController.getMessages);

// // SEND message (with optional multiple files)
// router.post('/sent', upload.array('files', 10), messageController.sendMessage);

// // ---------------- FETCH UPLOADED FILES ----------------
// // Example: GET /api/messages/files?folder=chat_uploads
// router.get('/files', async (req, res) => {
//   try {
//     const folder = req.query.folder || 'chat_uploads'; // default folder
//     const maxResults = parseInt(req.query.limit) || 50;

//     const result = await cloudinary.api.resources({
//       type: 'upload',
//       prefix: folder,
//       max_results: maxResults,
//       direction: 'desc', // latest uploads first
//     });

//     const files = result.resources.map((file) => ({
//       public_id: file.public_id,
//       url: file.secure_url,
//       format: file.format,
//       resource_type: file.resource_type,
//       created_at: file.created_at,
//       bytes: file.bytes,
//       folder: file.folder,
//     }));

//     res.status(200).json({
//       status: 'success',
//       count: files.length,
//       data: files,
//     });
//   } catch (err) {
//     console.error('⚠️ Error fetching files from Cloudinary:', err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to fetch files',
//       error: err.message,
//     });
//   }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const messageController = require('../controllers/messageController');
// const multer = require('multer');
// const { v2: cloudinary } = require('cloudinary');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // ---------------- CLOUDINARY CONFIG ----------------
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
//   api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
//   api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
// });

// // ---------------- MULTER STORAGE ----------------
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'chat_uploads',
//     resource_type: 'auto',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'mp4', 'docx', 'xlsx'],
//     transformation: [{ quality: 'auto', fetch_format: 'auto' }],
//   },
// });

// const upload = multer({ storage });

// // ---------------- ROUTES ----------------

// // Get chat messages for clicked contact
// router.get('/', messageController.getMessages);

// // Send message (with optional multiple files)
// router.post('/sent', upload.array('files', 10), messageController.sendMessage);

// // Get uploaded files for a chat
// router.get('/files', messageController.getFilesForChat);

// module.exports = router;


const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- MULTER STORAGE ----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();

    const rawFormats = ['doc', 'docx', 'xls', 'xlsx', 'txt'];
    const videoFormats = ['mp4', 'mov', 'avi'];
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];

    let resourceType = 'auto';
    if (rawFormats.includes(ext)) resourceType = 'raw';
    else if (videoFormats.includes(ext)) resourceType = 'video';
    else if (imageFormats.includes(ext)) resourceType = 'image';

    return {
      folder: 'chat_uploads',
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : [],
    };
  },
});

const upload = multer({ storage });

// ---------------- ROUTES ----------------
router.get('/', messageController.getMessages);
router.post('/sent', upload.array('files', 10), messageController.sendMessage);
router.get('/files', messageController.getFilesForChat);

module.exports = router;
