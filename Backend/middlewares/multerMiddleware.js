// const multer = require('multer');
// const path = require('path');

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Make sure the folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });
// module.exports = upload;

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();

    const rawFormats = ['doc', 'docx', 'xls', 'xlsx', 'txt'];
    const videoFormats = ['mp4', 'mov', 'avi'];
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];

    let resourceType = 'auto'; // default
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
