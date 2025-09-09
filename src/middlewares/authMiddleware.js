// src/middlewares/authMiddleware.js
// Middleware check auth giả
const authMiddleware = (req, res, next) => {
  console.log("🔑 Auth checked (fake)!");
  next();
};

module.exports = authMiddleware;
