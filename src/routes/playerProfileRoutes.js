const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const playerProfileController = require('../controllers/playerProfileController');

const {
    getPlayerProfile,
    updateCurrency,
    addCardToInventory,
    removeCardFromInventory,
} = playerProfileController;

/**
 * @swagger
 * tags:
 *   name: Player Profiles
 *   description: API quản lý hồ sơ người chơi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PlayerProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của hồ sơ người chơi
 *         user:
 *           type: string
 *           description: ID của người dùng (tham chiếu đến User model)
 *         currency:
 *           type: object
 *           properties:
 *             gold:
 *               type: number
 *               default: 0
 *             gem:
 *               type: number
 *               default: 0
 *           description: Tiền tệ của người chơi
 *         cards:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               card:
 *                 type: string
 *                 description: ID của thẻ bài (tham chiếu đến Card model)
 *               quantity:
 *                 type: number
 *                 default: 1
 *           description: Các thẻ bài trong kho của người chơi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo hồ sơ
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật hồ sơ cuối cùng
 *       example:
 *         _id: "60d0fe4f5e3a6b001c8e3a1a"
 *         user: "60d0fe4f5e3a6b001c8e3a1b"
 *         currency:
 *           gold: 1000
 *           gem: 50
 *         cards:
 *           - card: "60d0fe4f5e3a6b001c8e3a1c"
 *             quantity: 2
 *           - card: "60d0fe4f5e3a6b001c8e3a1d"
 *             quantity: 1
 *         createdAt: "2023-01-01T12:00:00.000Z"
 *         updatedAt: "2023-01-01T12:00:00.000Z"
 */

/**
 * @swagger
 * /player-profiles:
 *   get:
 *     summary: Lấy thông tin hồ sơ người chơi hiện tại
 *     tags: [Player Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ người chơi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       401:
 *         description: Không được ủy quyền
 *       404:
 *         description: Không tìm thấy hồ sơ người chơi
 */
router.get('/', protect, getPlayerProfile);

/**
 * @swagger
 * /player-profiles/currency:
 *   put:
 *     summary: Cập nhật tiền tệ (gold hoặc gem) của người chơi
 *     tags: [Player Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currencyType
 *               - amount
 *               - operation
 *             properties:
 *               currencyType:
 *                 type: string
 *                 enum: [gold, gem]
 *                 description: Loại tiền tệ cần cập nhật (gold hoặc gem)
 *                 example: gold
 *               amount:
 *                 type: number
 *                 description: Số lượng tiền tệ
 *                 example: 100
 *               operation:
 *                 type: string
 *                 enum: [add, subtract, set]
 *                 description: |
 *                   Phép toán thực hiện trên tiền tệ:
 *                   - add: Cộng thêm số tiền vào tài khoản (ví dụ: thưởng, nạp tiền)
 *                   - subtract: Trừ tiền từ tài khoản (ví dụ: mua đồ, thanh toán)
 *                   - set: Đặt số tiền cố định (ví dụ: reset, cheat mode)
 *                 example: add
 *     responses:
 *       200:
 *         description: Hồ sơ người chơi đã được cập nhật tiền tệ thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không đủ tiền tệ
 *       401:
 *         description: Không được ủy quyền
 *       404:
 *         description: Không tìm thấy hồ sơ người chơi
 */
router.put('/currency', protect, updateCurrency);

/**
 * @swagger
 * /player-profiles/cards:
 *   post:
 *     summary: Thêm thẻ bài vào kho của người chơi
 *     tags: [Player Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - quantity
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: ID của thẻ bài cần thêm
 *                 example: "60d0fe4f5e3a6b001c8e3a1c"
 *               quantity:
 *                 type: number
 *                 description: Số lượng thẻ bài cần thêm (mặc định là 1)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Thẻ bài đã được thêm vào kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không tìm thấy thẻ bài
 *       401:
 *         description: Không được ủy quyền
 *       404:
 *         description: Không tìm thấy hồ sơ người chơi
 */
router.post('/cards', protect, addCardToInventory);

/**
 * @swagger
 * /player-profiles/cards:
 *   delete:
 *     summary: Xóa thẻ bài khỏi kho của người chơi
 *     tags: [Player Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *             properties:
 *               cardId:
 *                 type: string
 *                 description: ID của thẻ bài cần xóa
 *                 example: "60d0fe4f5e3a6b001c8e3a1c"
 *               quantity:
 *                 type: number
 *                 description: Số lượng thẻ bài cần xóa (nếu không cung cấp, xóa tất cả)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Thẻ bài đã được xóa khỏi kho thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không đủ thẻ bài
 *       401:
 *         description: Không được ủy quyền
 *       404:
 *         description: Không tìm thấy hồ sơ người chơi
 */
router.delete('/cards', protect, removeCardFromInventory);

module.exports = router;