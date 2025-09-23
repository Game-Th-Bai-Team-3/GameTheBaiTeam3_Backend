// src/services/socketService.js
const cloudinaryService = require('./cloudinaryService');

const socketHandler = (io) => {
  console.log('🔌 Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Event: AI service kết nối
    socket.on('ai_service_connected', (data) => {
      console.log('🤖 AI Service connected:', data);
      socket.emit('ai_service_ready', { 
        message: 'AI service is ready to process images',
        timestamp: new Date().toISOString()
      });
    });

    // Event: AI service nhận request xử lý ảnh
    socket.on('ai_process_request', (data) => {
      console.log('📤 Broadcasting AI process request:', data);
      // Broadcast tới tất cả clients (bao gồm AI service)
      socket.broadcast.emit('ai_process_request', data);
    });

    // Event: AI service trả kết quả
    socket.on('ai_process_result', async (data) => {
      try {
        console.log('📥 Received AI result:', data);
        
        const { sessionId, resultImageUrl, success, error } = data;

        if (!success || !resultImageUrl) {
          // Nếu AI xử lý thất bại
          console.error('❌ AI processing failed:', error);
          io.emit('ai_process_error', {
            sessionId,
            success: false,
            message: error || 'AI processing failed'
          });
          return;
        }

        // Upload kết quả AI lên Cloudinary
        console.log('☁️ Uploading AI result to Cloudinary...');
        const cloudinaryUrl = await cloudinaryService.uploadFromUrl(
          resultImageUrl, 
          'game-the-bai/ai-output'
        );

        console.log('✨ AI result uploaded to Cloudinary:', cloudinaryUrl);

        // Broadcast kết quả cuối cùng tới tất cả clients
        io.emit('ai_process_complete', {
          sessionId,
          success: true,
          resultImageUrl: cloudinaryUrl,
          originalAIUrl: resultImageUrl,
          message: 'AI processing completed successfully',
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error processing AI result:', error);
        
        // Broadcast lỗi tới tất cả clients
        io.emit('ai_process_error', {
          sessionId: data.sessionId,
          success: false,
          message: error.message || 'Failed to process AI result',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Event: Client yêu cầu trạng thái xử lý
    socket.on('check_processing_status', (data) => {
      console.log('📋 Status check request:', data);
      // Echo lại thông tin trạng thái (có thể mở rộng với database sau)
      socket.emit('processing_status_update', {
        sessionId: data.sessionId,
        status: 'processing',
        message: 'Request is being processed by AI...',
        timestamp: new Date().toISOString()
      });
    });

    // Event: Xử lý lỗi
    socket.on('error', (error) => {
      console.error(`🚨 Socket error from ${socket.id}:`, error);
    });

    // Event: Client disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Event: Ping/Pong để kiểm tra kết nối
    socket.on('ping', () => {
      socket.emit('pong', { 
        timestamp: new Date().toISOString(),
        message: 'Socket connection is healthy'
      });
    });
  });

  // Middleware để log tất cả events
  io.engine.on("connection_error", (err) => {
    console.error('🚨 Socket connection error:', err.req);
    console.error('🚨 Error code:', err.code);
    console.error('🚨 Error message:', err.message);
    console.error('🚨 Error context:', err.context);
  });

  console.log('🎯 Socket.IO event handlers registered');
};

module.exports = socketHandler;
