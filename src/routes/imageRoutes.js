const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Upload 2 ảnh để AI xử lý
router.post('/process', imageController.uploadMultiple, imageController.processImages);

// Endpoint để AI gửi kết quả xử lý về
router.post('/ai-result', imageController.receiveAIResult);

// Kiểm tra trạng thái xử lý theo sessionId
router.get('/status/:sessionId', imageController.checkStatus);

module.exports = router; 