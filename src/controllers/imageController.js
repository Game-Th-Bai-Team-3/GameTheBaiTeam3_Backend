const cloudinaryService = require('../services/cloudinaryService');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu file trong memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép file ảnh (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  }
});

const imageController = {
  // Middleware để upload nhiều ảnh
  uploadMultiple: upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]),

  // Upload 2 ảnh lên Cloudinary và gửi qua socket để AI xử lý
  processImages: async (req, res) => {
    try {
      // Kiểm tra có đủ 2 ảnh không
      if (!req.files || !req.files.image1 || !req.files.image2) {
        return res.status(400).json({
          success: false,
          message: 'Cần upload đủ 2 ảnh để xử lý'
        });
      }

      const image1File = req.files.image1[0];
      const image2File = req.files.image2[0];

      // Upload ảnh lên Cloudinary
      const [image1Url, image2Url] = await Promise.all([
        cloudinaryService.uploadFromBuffer(image1File.buffer, 'game-the-bai/input'),
        cloudinaryService.uploadFromBuffer(image2File.buffer, 'game-the-bai/input')
      ]);

      console.log('🎭 Images uploaded to Cloudinary:', { image1Url, image2Url });

      // Lấy socket.io instance từ app
      const io = req.app.get('io');
      
      if (!io) {
        return res.status(500).json({
          success: false,
          message: 'Socket.IO chưa được khởi tạo'
        });
      }

      // Tạo unique session ID cho request này
      const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      // Emit tới AI service qua socket
      io.emit('ai_process_request', {
        sessionId,
        image1Url,
        image2Url,
        timestamp: new Date().toISOString()
      });

      console.log('🚀 Sent images to AI via socket:', sessionId);

      // Trả về response ngay lập tức với thông tin upload thành công
      res.status(200).json({
        success: true,
        message: 'Đã upload ảnh thành công và gửi đến AI để xử lý',
        data: {
          sessionId,
          image1Url,
          image2Url,
          status: 'processing'
        }
      });

    } catch (error) {
      console.error('❌ Error in processImages:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xử lý ảnh'
      });
    }
  },

  // Endpoint để nhận kết quả từ AI và lưu lên Cloudinary
  receiveAIResult: async (req, res) => {
    try {
      const { sessionId, resultImageUrl } = req.body;

      if (!sessionId || !resultImageUrl) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu sessionId hoặc resultImageUrl'
        });
      }

      // Upload ảnh kết quả lên Cloudinary từ URL AI trả về
      const cloudinaryUrl = await cloudinaryService.uploadFromUrl(
        resultImageUrl, 
        'game-the-bai/output'
      );

      console.log('🎯 AI result uploaded to Cloudinary:', cloudinaryUrl);

      // Lấy socket.io instance
      const io = req.app.get('io');
      
      // Gửi kết quả cuối cùng tới frontend
      io.emit('ai_process_complete', {
        sessionId,
        success: true,
        resultImageUrl: cloudinaryUrl,
        originalAIUrl: resultImageUrl,
        message: 'Xử lý AI hoàn thành'
      });

      res.status(200).json({
        success: true,
        message: 'Đã lưu kết quả AI và gửi tới frontend',
        data: {
          sessionId,
          resultImageUrl: cloudinaryUrl
        }
      });

    } catch (error) {
      console.error('❌ Error in receiveAIResult:', error);
      
      // Thông báo lỗi qua socket
      const io = req.app.get('io');
      if (io && req.body.sessionId) {
        io.emit('ai_process_error', {
          sessionId: req.body.sessionId,
          success: false,
          message: error.message || 'Có lỗi xảy ra khi xử lý kết quả AI'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xử lý kết quả AI'
      });
    }
  },

  // Kiểm tra trạng thái xử lý theo sessionId
  checkStatus: async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Ở đây bạn có thể implement logic lưu trạng thái trong database
      // Hiện tại chỉ trả về thông tin cơ bản
      res.status(200).json({
        success: true,
        data: {
          sessionId,
          status: 'processing',
          message: 'Đang xử lý bởi AI...'
        }
      });
    } catch (error) {
      console.error('❌ Error in checkStatus:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi kiểm tra trạng thái'
      });
    }
  }
};

module.exports = imageController; 