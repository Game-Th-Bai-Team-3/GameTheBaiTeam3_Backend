const { getProtectedMessage } = require("../services/protectedService");

const protectedRoute = (req, res) => {
  const message = getProtectedMessage(req.user);
  res.status(200).json({ message });
};

module.exports = { protectedRoute };
