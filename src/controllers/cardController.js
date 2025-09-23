// controllers/cardController.js
const { formatCard } = require('../helpers/cardFormatter');
const cardService = require('../services/cardService');
const { emitToAllFE } = require('../utils/socketHandler');

exports.createCardFromImageOnly = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const card = await cardService.createCardFromFile(file);
    res.status(201).json({
      message: 'Thẻ bài đã được tạo thành công từ ảnh',
      card,
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

