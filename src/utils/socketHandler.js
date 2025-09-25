const { Server } = require('socket.io');

class SocketHandler {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // Cho phép tất cả origins trong development
        methods: ["GET", "POST"]
      }
    });
    
    this.aiSocket = null; // Socket của AI
    this.frontendSockets = new Map(); // Map để lưu socket của frontend
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // AI kết nối
      socket.on('ai_connected', (data) => {
        console.log('AI đã kết nối:', data);
        this.aiSocket = socket;
        socket.emit('ai_connection_confirmed', { 
          status: 'success', 
          message: 'AI đã được xác nhận kết nối' 
        });
      });

      // Frontend kết nối
      socket.on('frontend_connected', (data) => {
        console.log('Frontend đã kết nối:', data);
        this.frontendSockets.set(socket.id, socket);
        socket.emit('frontend_connection_confirmed', { 
          status: 'success', 
          message: 'Frontend đã được xác nhận kết nối' 
        });
      });

      // AI gửi kết quả xử lý ảnh
      socket.on('ai_image_processed', (data) => {
        console.log('AI đã xử lý ảnh:', data);
        this.handleAIResponse(data);
      });

      // Xử lý khi client disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Xóa khỏi danh sách frontend sockets
        if (this.frontendSockets.has(socket.id)) {
          this.frontendSockets.delete(socket.id);
        }
        
        // Reset AI socket nếu AI disconnect
        if (this.aiSocket && this.aiSocket.id === socket.id) {
          this.aiSocket = null;
          console.log('AI đã ngắt kết nối');
        }
      });
    });
  }

  // Emit ảnh cho AI để xử lý
  emitImageToAI(imageData) {
    if (!this.aiSocket) {
      throw new Error('AI chưa kết nối');
    }

    console.log('Gửi ảnh cho AI để xử lý:', imageData);
    this.aiSocket.emit('process_images', {
      ...imageData,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // Xử lý response từ AI
  handleAIResponse(data) {
    console.log('Nhận response từ AI:', data);
    
    // Emit ảnh mới đến tất cả frontend clients
    this.frontendSockets.forEach((socket) => {
      socket.emit('new_merged_image', {
        status: 'success',
        data: data,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Emit ảnh mới được tạo đến frontend
  emitNewImageToFrontend(imageData) {
    this.frontendSockets.forEach((socket) => {
      socket.emit('new_generated_image', {
        status: 'success',
        data: imageData,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Kiểm tra AI có kết nối không
  isAIConnected() {
    return this.aiSocket !== null;
  }

  // Lấy số lượng frontend clients
  getFrontendClientsCount() {
    return this.frontendSockets.size;
  }
}

module.exports = SocketHandler;
