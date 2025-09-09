// src/config/db.js
// Fake DB connection (sau này bạn có thể thay bằng MongoDB/MySQL)
const connectDB = async () => {
  try {
    console.log("✅ Database connected (fake)!");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
