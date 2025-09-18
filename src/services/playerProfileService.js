const PlayerProfile = require('../models/playerProfile');
const Card = require('../models/cards');

// Tìm player profile theo userId
const findPlayerProfileByUserId = async (userId) => {
    const playerProfile = await PlayerProfile.findOne({ user: userId });
    if (!playerProfile) {
        throw new Error('Không tìm thấy player profile.');
    }
    return playerProfile;
};

// Update tiền tệ (gold, gem)
const updateCurrency = async (userId, currencyType, amount, operation) => {
    const playerProfile = await findPlayerProfileByUserId(userId);

    if (!['gold', 'gem'].includes(currencyType)) {
        throw new Error('Tiền tệ không tồn tại.');
    }

    if (operation === 'add') {
        playerProfile.currency[currencyType] += amount;
    } else if (operation === 'subtract') {
        if (playerProfile.currency[currencyType] < amount) {
            throw new Error(`Không đủ ${currencyType}.`);
        }
        playerProfile.currency[currencyType] -= amount;
    } else if (operation === 'set') {
        playerProfile.currency[currencyType] = amount;
    } else {
        throw new Error('Phép toán không tồn tại.');
    }

    await playerProfile.save();
    return playerProfile;
};

// Thêm thẻ vào túi đồ
const addCardToInventory = async (userId, cardId, quantity = 1) => {
    const playerProfile = await findPlayerProfileByUserId(userId);

    const cardExists = await Card.findById(cardId);
    if (!cardExists) {
        throw new Error('Không tìm thấy thẻ.');
    }

    const existingCardIndex = playerProfile.cards.findIndex(
        (item) => item.card.toString() === cardId
    );

    if (existingCardIndex > -1) {
        playerProfile.cards[existingCardIndex].quantity += quantity;
    } else {
        playerProfile.cards.push({ card: cardId, quantity });
    }

    await playerProfile.save();
    return playerProfile;
};

// Lấy thẻ khỏi túi đồ
const removeCardFromInventory = async (userId, cardId, quantityToRemove) => {
    const playerProfile = await findPlayerProfileByUserId(userId);

    const existingCardIndex = playerProfile.cards.findIndex(
        (item) => item.card.toString() === cardId
    );

    if (existingCardIndex === -1) {
        throw new Error('Không tìm thấy thẻ trong túi đồ.');
    }

    if (quantityToRemove) {
        if (playerProfile.cards[existingCardIndex].quantity < quantityToRemove) {
            throw new Error('Không đủ thẻ để lấy ra khỏi túi đồ.');
        }
        playerProfile.cards[existingCardIndex].quantity -= quantityToRemove;
    } else {
        // Nếu không chỉ định số lượng, loại bỏ toàn bộ thẻ
        playerProfile.cards.splice(existingCardIndex, 1);
    }

    // Nếu số lượng thẻ còn lại là 0, loại bỏ thẻ khỏi túi đồ
    if (playerProfile.cards[existingCardIndex] && playerProfile.cards[existingCardIndex].quantity <= 0) {
        playerProfile.cards.splice(existingCardIndex, 1);
    }

    await playerProfile.save();
    return playerProfile;
};

// Trả về full profile của người chơi
const getPlayerProfile = async (userId) => {
    const playerProfile = await PlayerProfile.findOne({ user: userId })
        .populate('user')
        .populate('cards.card');
    
    if (!playerProfile) {
        throw new Error('Không tìm thấy player profile.');
    }
    return playerProfile;
};

module.exports = {
    updateCurrency,
    addCardToInventory,
    removeCardFromInventory,
    getPlayerProfile,
};