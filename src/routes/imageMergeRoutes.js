const express = require('express');
const router = express.Router();
const ImageMergeController = require('../controllers/imageMergeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     MergeImagesRequest:
 *       type: object
 *       required:
 *         - cardId1
 *         - cardId2
 *       properties:
 *         cardId1:
 *           type: string
 *           description: ID của card đầu tiên
 *         cardId2:
 *           type: string
 *           description: ID của card thứ hai
 *     
 *     AIUploadRequest:
 *       type: object
 *       required:
 *         - requestId
 *         - imageBase64
 *       properties:
 *         requestId:
 *           type: string
 *           description: ID của request từ lần gọi merge images
 *         imageBase64:
 *           type: string
 *           description: Ảnh được encode base64
 *         description:
 *           type: string
 *           description: Mô tả cho ảnh được tạo
 */

/**
 * @swagger
 * /api/image-merge/merge:
 *   post:
 *     summary: Ghép ảnh từ 2 cards và gửi cho AI xử lý
 *     tags: [Image Merge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MergeImagesRequest'
 *     responses:
 *       200:
 *         description: Đã gửi yêu cầu ghép ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                     card1:
 *                       type: object
 *                     card2:
 *                       type: object
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy cards
 *       503:
 *         description: AI service chưa kết nối
 */
router.post('/merge', ImageMergeController.mergeImages);

/**
 * @swagger
 * /api/image-merge/ai-upload:
 *   post:
 *     summary: API để AI upload ảnh đã tạo và lưu vào Cloudinary
 *     tags: [Image Merge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIUploadRequest'
 *     responses:
 *       200:
 *         description: Đã lưu ảnh và gửi đến frontend thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     publicId:
 *                       type: string
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi upload ảnh
 */
router.post('/ai-upload', ImageMergeController.uploadAIGeneratedImage);

/**
 * @swagger
 * /api/image-merge/status:
 *   get:
 *     summary: Kiểm tra trạng thái kết nối AI và frontend
 *     tags: [Image Merge]
 *     responses:
 *       200:
 *         description: Trạng thái kết nối
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     aiConnected:
 *                       type: boolean
 *                     frontendClients:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *       500:
 *         description: Lỗi server
 */
router.get('/status', ImageMergeController.getConnectionStatus);

/**
 * @swagger
 * /api/image-merge/batch:
 *   post:
 *     summary: Ghép nhiều cặp ảnh cùng lúc (batch processing)
 *     tags: [Image Merge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardPairs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     cardId1:
 *                       type: string
 *                     cardId2:
 *                       type: string
 *                 maxItems: 10
 *     responses:
 *       200:
 *         description: Đã xử lý batch merge thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       503:
 *         description: AI service chưa kết nối
 */
router.post('/batch', ImageMergeController.batchMergeImages);

/**
 * @swagger
 * /api/image-merge/advanced:
 *   post:
 *     summary: Ghép ảnh với nhiều tùy chọn nâng cao
 *     tags: [Image Merge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 maxItems: 5
 *               mergeType:
 *                 type: string
 *                 enum: [fusion, combination, evolution]
 *                 default: fusion
 *               style:
 *                 type: string
 *                 enum: [default, anime, realistic, cartoon]
 *                 default: default
 *               background:
 *                 type: string
 *                 enum: [transparent, solid, gradient]
 *                 default: transparent
 *               effects:
 *                 type: array
 *                 items:
 *                   type: string
 *               outputFormat:
 *                 type: string
 *                 enum: [png, jpg, webp]
 *                 default: png
 *               quality:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: high
 *     responses:
 *       200:
 *         description: Đã gửi yêu cầu ghép ảnh nâng cao thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy cards
 *       503:
 *         description: AI service chưa kết nối
 */
router.post('/advanced', ImageMergeController.advancedMergeImages);

/**
 * @swagger
 * /api/image-merge/history:
 *   get:
 *     summary: Lấy lịch sử ảnh đã tạo
 *     tags: [Image Merge]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Trường để sort
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Thứ tự sort
 *     responses:
 *       200:
 *         description: Danh sách lịch sử ảnh
 *       500:
 *         description: Lỗi server
 */
router.get('/history', ImageMergeController.getImageHistory);

/**
 * @swagger
 * /api/image-merge/history/{requestId}:
 *   get:
 *     summary: Lấy chi tiết một request
 *     tags: [Image Merge]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của request
 *     responses:
 *       200:
 *         description: Chi tiết request
 *       404:
 *         description: Không tìm thấy request
 *       500:
 *         description: Lỗi server
 */
router.get('/history/:requestId', ImageMergeController.getImageRequestDetail);

/**
 * @swagger
 * /api/image-merge/history/{requestId}:
 *   delete:
 *     summary: Xóa ảnh đã tạo và lịch sử
 *     tags: [Image Merge]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của request
 *     responses:
 *       200:
 *         description: Đã xóa thành công
 *       404:
 *         description: Không tìm thấy request
 *       500:
 *         description: Lỗi server
 */
router.delete('/history/:requestId', ImageMergeController.deleteGeneratedImage);

module.exports = router;
