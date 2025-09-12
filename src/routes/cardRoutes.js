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
    deleteCard
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
 *         description:
 *           type: string
 *         rarity:
 *           type: string
 *           enum: [Common, Uncommon, Rare, Epic, Legendary]
 *         species:
 *           type: string
 *         element:
 *           type: string
 *           enum: [Normal, Fire, Water, Earth, Grass, Electric]
 *         stats:
 *           type: object
 *           properties:
 *             attack:
 *               type: number
 *             hp:
 *               type: number
 *         baseCards:
 *           type: array
 *           items:
 *             type: string
 *         image:
 *           type: string
 *           description: "Base64 hoặc buffer string ảnh"
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
 *               - element
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fire Dragon"
 *               description:
 *                 type: string
 *                 example: "A mighty dragon born from fire"
 *               rarity:
 *                 type: string
 *                 enum: [Common, Uncommon, Rare, Epic, Legendary]
 *                 example: "Epic"
 *               species:
 *                 type: string
 *                 example: "Dragon"
 *               element:
 *                 type: string
 *                 enum: [Normal, Fire, Water, Earth, Grass, Electric]
 *                 example: "Fire"
 *               stats[attack]:
 *                 type: integer
 *                 example: 50
 *               stats[hp]:
 *                 type: integer
 *                 example: 200
 *               baseCards:
 *                 type: string
 *                 example: '[]'
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
 *         description: ObjectId của thẻ bài cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fire Dragon V2"
 *               description:
 *                 type: string
 *                 example: "Evolved version of Fire Dragon"
 *               rarity:
 *                 type: string
 *                 enum: [Common, Uncommon, Rare, Epic, Legendary]
 *                 example: "Legendary"
 *               species:
 *                 type: string
 *                 example: "Ancient Dragon"
 *               element:
 *                 type: string
 *                 enum: [Normal, Fire, Water, Earth, Grass, Electric]
 *                 example: "Fire"
 *               stats:
 *                 type: string
 *                 example: '{"attack":80,"hp":300}'
 *               baseCards:
 *                 type: string
 *                 example: '[]'
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thẻ bài đã được cập nhật thành công
 *       404:
 *         description: Không tìm thấy thẻ bài
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
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
