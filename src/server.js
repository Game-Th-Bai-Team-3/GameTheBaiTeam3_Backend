// src/server.js
const dotenv = require("dotenv");
const http = require("http");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const SocketHandler = require("./utils/socketHandler");

connectDB();

const PORT = process.env.PORT || 5000;

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo Socket.io
const socketHandler = new SocketHandler(server);

// Export socketHandler để sử dụng trong các controller
app.set('socketHandler', socketHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});
