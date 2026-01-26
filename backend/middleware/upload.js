const multer = require('multer');

// Use memory storage so we can stream to Cloudinary without temp files
const storage = multer.memoryStorage();

// Common file filter for images/videos
function fileFilter(req, file, cb) {
  // Accept images and videos; basic check by mimetype
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video uploads are allowed'));
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

module.exports = {
  upload,
};
