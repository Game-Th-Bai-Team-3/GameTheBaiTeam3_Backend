// routes/cards.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const cardController = require('../controllers/cardController');

const {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  getCardImageById,
} = cardController;

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: API quản lý thẻ bài
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         genCore:
 *           type: number
 *         origin:
 *           type: string
 *         feature:
 *           type: string
 *         symbol:
 *           type: string
 *         power:
 *           type: number
 *         defense:
 *           type: number
 *         magic:
 *           type: number
 *         skill:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             - name: "Nguyệt Hống"
 *               description: "Tiếng hú gây choáng diện rộng"
 *             - name: "Ảnh Ảo Tốc"
 *               description: "Di chuyển như bóng, né tránh công kích"
 *         parents:
 *           type: array
 *           items:
 *             type: string
 *             description: "ObjectId tham chiếu đến Card cha"
 *         imageUrl:
 *           type: string
 *           description: "URL lấy ảnh card"
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Tạo thẻ bài mới
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - genCore
 *               - origin
 *               - feature
 *               - symbol
 *               - power
 *               - defense
 *               - magic
 *               - skill
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lupharos – Sói Bóng Đêm"
 *               genCore:
 *                 type: number
 *                 example: 2
 *               origin:
 *                 type: string
 *                 example: " Sinh ra từ bóng tối nguyên thủy trước khi Mặt Trăng xuất hiện, được coi là kẻ dẫn đường cho những kẻ lạc lối trong đêm."
 *               feature:
 *                 type: string
 *                 example: "Bộ lông đen ánh bạc, mắt sáng như sao trời"
 *               symbol:
 *                 type: string
 *                 example: "Tự do – bản năng – sự trung thành"
 *               power:
 *                 type: number
 *                 example: 80
 *               defense:
 *                 type: number
 *                 example: 60
 *               magic:
 *                 type: number
 *                 example: 70
 *               skill:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 example:
 *                   - name: "Nguyệt Hống"
 *                     description: "Tiếng hú gây choáng diện rộng"
 *                   - name: "Ảnh Ảo Tốc"
 *                     description: "Di chuyển như bóng, né tránh công kích"
 *               parents:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Thẻ bài đã được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */
router.post('/', protect, upload.single('image'), createCard);

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Lấy danh sách tất cả thẻ bài
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Danh sách thẻ bài
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/', getAllCards);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Lấy thông tin thẻ bài theo ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin thẻ bài
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Không tìm thấy thẻ bài
 */
router.get('/:id', getCardById);

/**
 * @swagger
 * /cards/{id}/image:
 *   get:
 *     summary: Lấy ảnh thẻ bài theo ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ảnh thẻ bài
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.get('/:id/image', getCardImageById);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Cập nhật thẻ bài theo ID
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lupharos – Sói Bóng Đêm_V2"
 *               genCore:
 *                 type: number
 *                 example: 2
 *               origin:
 *                 type: string
 *                 default: ""
 *               feature:
 *                 type: string
 *                 default: ""
 *               symbol:
 *                 type: string
 *                 default: ""
 *               power:
 *                 type: number
 *                 example: 80
 *               defense:
 *                 type: number
 *                 example: 60
 *               magic:
 *                 type: number
 *                 example: 70
 *               skill:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                 default: []
 *                 # Không để example → Swagger UI sẽ show mảng trống
 *               parents:
 *                 type: array
 *                 items:
 *                   type: string
 *                 default: []
 *                 # Không để example → Swagger UI sẽ show mảng trống
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thẻ bài đã được cập nhật thành công
 *       404:
 *         description: Không tìm thấy thẻ bài
 */

router.put('/:id', protect, upload.single('image'), updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Xóa thẻ bài theo ID
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thẻ bài đã được xóa thành công
 *       404:
 *         description: Không tìm thấy thẻ bài
 */
router.delete('/:id', protect, deleteCard);

module.exports = router;
