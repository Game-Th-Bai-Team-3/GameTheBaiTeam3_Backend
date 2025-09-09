const jwt = require("jsonwebtoken");

exports.generateTokenPair = (user) => {
  console.log("[DEBUG] exports.generateTokenPair = (user)");
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3h", // access token ngắn hạn
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // refresh token dài hạn
  });

  return { accessToken, refreshToken }; //
};
