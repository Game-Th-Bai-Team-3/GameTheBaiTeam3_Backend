const cardController = require('../controllers/cardController');
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

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
 *   description: API để quản lý thẻ bài 
 */

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Tạo thẻ bài mới  cái BaseCard 1 là để cardID 2 là để trống nếu khhoong là lỗi 
 *     tags: [Cards]
 *     security:
 *       - BearerAuth: []
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *               stats:
 *                 type: object
 *                 properties:
 *                   attack:
 *                     type: number
 *                     example: 50
 *                   hp:
 *                     type: number
 *                     example: 200
 *               baseCards:
 *                 type: array
 *                 description: Mảng các ID của thẻ cơ sở có thể để trống (nếu để trống thì xóa cái ""string" đi)
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 example: "http://example.com/image.png"
 *     responses:
 *       201:
 *         description: Thẻ bài đã được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */


router.post('/', protect, createCard);

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
 *       400:
 *         description: Lỗi khi lấy dữ liệu
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
 *         description: ObjectId của thẻ bài cần lấy
 *     responses:
 *       200:
 *         description: Thông tin thẻ bài
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Không tìm thấy thẻ bài
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */


router.get('/:id', getCardById);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Cập nhật thẻ bài theo ID
 *     tags: [Cards]
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
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Fire Dragon Updated"
 *               description: "A stronger fire dragon"
 *               rarity: "Epic"
 *               species: "Dragon"
 *               element: "Fire"
 *               stats:
 *                 attack: 60
 *                 hp: 250
 *               baseCards: []
 *               image: "http://example.com/fire_dragon_updated.png"
 *     responses:
 *       200:
 *         description: Thẻ bài đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thẻ bài đã được cập nhật thành công"
 *                 card:
 *                   $ref: '#/components/schemas/Card'
 *       404:
 *         description: Không tìm thấy thẻ bài
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */

router.put('/:id', protect, updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Xóa thẻ bài theo ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId của thẻ bài cần xóa
 *     responses:
 *       200:
 *         description: Thẻ bài đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thẻ bài đã được xóa thành công"
 *       404:
 *         description: Không tìm thấy thẻ bài
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */
router.delete('/:id', protect, deleteCard);

module.exports = router;
