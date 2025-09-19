const express = require('express');

const {register, login, verifyOtp, resendOtp , forgotPassword, 
    resetPassword, changePassword,refreshToken } = require('../controllers/authController');


const {authMiddleware, authorizeRoles} = require('../middlewares/authMiddleware');
const {validateRegister, validateForgotPassword, validateResetPassword} = require('../middlewares/validateUser');
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       201:
 *         description: Người dùng đã được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */
router.post('/register',validateRegister, register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Xác thực tài khoản bằng OTP
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xác thực thành công, bạn có thể đăng nhập
 *       400:
 *         description: OTP không hợp lệ hoặc đã hết hạn
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Gửi lại OTP cho tài khoản chưa xác thực
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Email của tài khoản cần gửi lại OTP
 *     responses:
 *       200:
 *         description: OTP mới đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP mới đã được gửi thành công. Vui lòng kiểm tra email của bạn.
 *       400:
 *         description: Email không tồn tại hoặc tài khoản đã được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Tài khoản đã được xác thực. Bạn đã có thể đăng nhập.
 */
router.post('/resend-otp', resendOtp);



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Lấy access token mới bằng refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Trả về access token mới và refresh token mới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 */

router.post('/refresh-token', refreshToken);
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Thay đổi mật khẩu người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: CurPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass456
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mật khẩu đã được thay đổi thành công.
 *       400:
 *         description: Email hoặc mật khẩu hiện tại không đúng
 */
router.post('/change-password', changePassword);


/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu - Tạo reset token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Email của tài khoản cần reset mật khẩu
 *     responses:
 *       200:
 *         description: Reset token đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email reset mật khẩu đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn.
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                   description: Email đã được gửi reset link
 *                 expiry:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T10:10:00.000Z
 *                   description: Thời gian hết hạn của reset token
 *       400:
 *         description: Email không hợp lệ hoặc không tồn tại
 */
router.post('/forgot-password', validateForgotPassword, forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu với reset token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 *                 description: Reset token nhận được từ forgot-password API
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPass123
 *                 description: Mật khẩu mới (ít nhất 6 ký tự)
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đặt lại mật khẩu thành công
 *       400:
 *         description: Token không hợp lệ, đã hết hạn hoặc dữ liệu không hợp lệ
 */
router.post('/reset-password', validateResetPassword, resetPassword);

// Email service routes




module.exports = router;