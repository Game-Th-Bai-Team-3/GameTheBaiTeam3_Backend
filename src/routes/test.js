// routes/testRoute.js
const express = require("express");
const router = express.Router();
const { emitToAllFE, emitToC } = require("../utils/socketHandler");

// Gửi message tới tất cả FE
router.get("/send-fe", (req, res) => {
  emitToAllFE("message", { text: "Hello FE 🚀" });
  res.json({ ok: true, msg: "Đã gửi message tới FE" });
});

// Gửi message tới C
router.get("/send-c", (req, res) => {
  emitToC("message", { text: "Hello C 💻" });
  res.json({ ok: true, msg: "Đã gửi message tới C" });
});

module.exports = router;
