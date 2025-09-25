const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    //nếu là kết nối từ C (AI) thì bỏ qua check
    const isC = socket.handshake.query?.type === "C";
    if (isC) return next();

    // nếu là FE thì check token
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Chưa đăng nhập"));
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Gắn thông tin user vào socket
        next();
    }catch (error){
        return next(new Error("Token không hợp lệ hoặc đã hết hạn"));
    }
};
module.exports = socketAuth;