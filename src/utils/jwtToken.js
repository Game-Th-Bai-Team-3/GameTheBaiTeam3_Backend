const jwt = require("jsonwebtoken");

const generateTokenPair = (user) => {
  const payload = { id: user._id, role: user.role };

  // Access token: ngắn hạn
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Refresh token: dài hạn
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7h",
  });

  return { accessToken, refreshToken };
};

module.exports = { generateTokenPair };
