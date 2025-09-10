const cardService = require('../services/cardService');

exports.createCard = async (req, res) => {
    try {
        const card = await cardService.createCard(req.body);
        res.status(201).json({
            message: 'Thẻ bài đã được tạo thành công',
            card: card
    });
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllCards = async (req, res) => {
    try {
        const cards = await cardService.getAllCards();
        res.json(cards);
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
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCard = async (req, res) => {
    try{
        const card = await cardService.updateCard(req.params.id, req.body);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    }catch (error) {
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
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
};