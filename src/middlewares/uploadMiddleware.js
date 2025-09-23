const multer = require('multer');
const path = require('path');

// Cấu hình lưu file trong memory để upload lên Cloudinary
const storage = multer.memoryStorage();

// Cấu hình multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Cho phép các định dạng ảnh
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh (JPEG, PNG, GIF, WEBP)'), false);
    }
  }
});

module.exports = upload; 