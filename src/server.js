// src/server.js
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
connectDB();

const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./utils/socketHandler");

const PORT = process.env.PORT || 5000;

// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Tạo Socket.IO server
const io = new Server(server, {
  cors: {origin: "*"}, // Cho phép tất cả các nguồn (thay đổi theo nhu cầu bảo mật)
});

// gan socketHandler để xử lý các sự kiện socket
socketHandler(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
