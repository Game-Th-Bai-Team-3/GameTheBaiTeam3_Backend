const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("username")
    .notEmpty().withMessage("Username bắt buộc")
    .isLength({ min: 3, max: 30 }).withMessage("Username từ 3-30 ký tự"),
  body("email")
    .notEmpty().withMessage("Email bắt buộc")
    .isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .notEmpty().withMessage("Password bắt buộc")
    .isLength({ min: 6 }).withMessage("Password ít nhất 6 ký tự"),
  body("role")
    .optional()
    .isIn(["user", "admin"]).withMessage("Role chỉ nhận user hoặc admin"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateForgotPassword = [
  body("email")
    .notEmpty().withMessage("Email bắt buộc")
    .isEmail().withMessage("Email không hợp lệ"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateResetPassword = [
  body("token")
    .notEmpty().withMessage("Reset token bắt buộc")
    .isLength({ min: 32 }).withMessage("Reset token không hợp lệ"),
  body("newPassword")
    .notEmpty().withMessage("Password mới bắt buộc")
    .isLength({ min: 6 }).withMessage("Password mới ít nhất 6 ký tự"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister, validateForgotPassword, validateResetPassword };
