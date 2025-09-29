// controllers/cardController.js
const { formatCard } = require('../helpers/cardFormatter');
const cardService = require('../services/cardService');
const { emitToAllFE } = require('../utils/socketHandler');
const socketHandler = require('../utils/socketHandler');
const PendingRequest = require('../models/pendingRequest');

exports.createCardFromImageOnly = async (req, res) => {
  try {
    const file = req.file;
    const { requestId } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    let parentIds = [];
    let userId = null;
    let pending = null;

    if (requestId) {
      pending = await PendingRequest.findOne({ requestId });
      if (pending) {
        parentIds = pending.cardIds;
        userId = pending.userId;
        // xóa pending sau khi dùng
        await PendingRequest.deleteOne({ requestId });
      }
    }

    // tạo thẻ mới với parentIds (có thể rỗng)
    const card = await cardService.createCardFromImageOnly(file, parentIds, userId);

    // emit cho tất cả FE
    emitToAllFE("new-card-ready", { 
      cardId: card._id, 
      img: card.imageUrl, 
      parentIds 
    });

    res.status(201).json({
      message: 'Thẻ bài đã được tạo thành công từ ảnh',
      cardId: card._id,
      imageUrl: card.imageUrl,
      parentIds
      
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const card = await cardService.createCard(req.body, req.file);
    res.status(201).json({
      message: 'Thẻ bài đã được tạo thành công',
      card,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await cardService.getAllCards();
    res.json(cards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Lấy ảnh thẻ theo ID
exports.getCardImageById = async (req, res) => {
  try {
    const imageUrl = await cardService.getCardImageById(req.params.id);
    if (!imageUrl) {
      return res.status(404).json({ error: 'Card or image not found' });
    }
    console.log("📤 Emitting newCard to FE", imageUrl);
emitToAllFE("newCard", { cardId: req.params.id, img: imageUrl });
    // emit cho tất cả FE khi có ai đó lấy ảnh thẻ
    
   res.json({ imageUrl });
  }catch (error) {
    res.status(400).json({ error: error.message });
  }
};
  


exports.getCardById = async (req, res) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await cardService.updateCard(req.params.id, req.body, req.file);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({
      message: 'Thẻ bài đã được cập nhật thành công',
      card,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await cardService.deleteCard(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// lay url anh the
exports.sendCards = async (req, res) => {
  const { cardIds } = req.body;
  const requestId = Date.now().toString(); // Tạo requestId duy nhất

  const imageUrls = await cardService.getCardLinksByIds(cardIds);
  // tao pending request
  await PendingRequest.create({ requestId, cardIds,userId: req.user.id });
  // gui du lieu cho C
  socketHandler.emitToC("process-cards", { requestId, imageUrls });
  res.json({ message: 'Yêu cầu gửi thẻ đã được gửi đến C', requestId });
};

