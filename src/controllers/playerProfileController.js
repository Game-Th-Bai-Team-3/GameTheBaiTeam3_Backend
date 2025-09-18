const playerProfileService = require('../services/playerProfileService');

// Lấy player profile
const getPlayerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const playerProfile = await playerProfileService.getPlayerProfile(userId);
        res.status(200).json(playerProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update tiền tệ (gold, gem)
const updateCurrency = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currencyType, amount, operation } = req.body;
        const updatedProfile = await playerProfileService.updateCurrency(
            userId,
            currencyType,
            amount,
            operation
        );
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Thêm thẻ vào túi đồ
const addCardToInventory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cardId, quantity } = req.body;
        const updatedProfile = await playerProfileService.addCardToInventory(
            userId,
            cardId,
            quantity
        );
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy thẻ khỏi túi đồ
const removeCardFromInventory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cardId, quantity } = req.body;
        const updatedProfile = await playerProfileService.removeCardFromInventory(
            userId,
            cardId,
            quantity
        );
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPlayerProfile,
    updateCurrency,
    addCardToInventory,
    removeCardFromInventory,
};