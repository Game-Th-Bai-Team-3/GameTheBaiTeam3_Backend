let cSocket = null;      // Chỉ giữ 1 C (máy xử lý ảnh)
let feSockets = [];      // Danh sách tất cả FE

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // 👉 FE đăng ký
    socket.on("registerFE", () => {
      feSockets.push(socket);
      console.log("📱 FE registered:", socket.id);
    });

    // 👉 C đăng ký
    socket.on("registerC", () => {
      cSocket = socket;
      console.log("🖥️ C registered:", socket.id);
    });

    // 👉 FE gửi test event
    socket.on("testEvent", (data) => {
      console.log("📤 FE gửi testEvent:", data);
      // Trả ngược lại cho FE
      socket.emit("notify", { msg: "BE nhận được từ FE", data });
    });

    // 👉 C gửi test event
    socket.on("testEventC", (data) => {
      console.log("📤 C gửi testEventC:", data);
      // Trả ngược lại cho C
      socket.emit("notify", { msg: "BE nhận được từ C", data });
    });

    // 👉 Khi disconnect
    socket.on("disconnect", () => {
      feSockets = feSockets.filter((s) => s.id !== socket.id);
      if (cSocket?.id === socket.id) {
        cSocket = null;
      }
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

// 👉 Các hàm để service gọi emit
module.exports.getCsocket = () => cSocket;
module.exports.getFEsockets = () => feSockets;

module.exports.emitToAllFE = (event, data) => {
  feSockets.forEach((s) => s.emit(event, data));
};

module.exports.emitToC = (event, data) => {
  if (cSocket) {
    cSocket.emit(event, data);
  } else {
    console.log("⚠️ No C connected!");
  }
};
