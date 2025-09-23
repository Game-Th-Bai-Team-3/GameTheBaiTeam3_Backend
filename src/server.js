// src/server.js
const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const socketHandler = require("./services/socketService");

connectDB();

const PORT = process.env.PORT || 5000;

// Tạo HTTP server
const server = http.createServer(app);

// Cấu hình Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Có thể cấu hình cụ thể domain frontend
    methods: ["GET", "POST"]
  }
});

// Lưu socket.io instance vào app để controller có thể sử dụng
app.set('io', io);

// Kết nối Socket.IO với server
socketHandler(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
});
