const Card = require('../models/cards');

// Tạo thẻ mới

exports.createCard = async (data) => {
    const existingCard = await Card.findOne({ name: data.name });
    if (existingCard) {
        throw new Error("Thẻ với tên này đã tồn tại");
    }
    return await Card.create(data);
};

// Lấy tất cả thẻ
exports.getAllCards = async () => {
    return await Card.find();
};
// Lấy thẻ theo ID
exports.getCardById = async (id) => {
    return await Card.findById(id);
};
// Cập nhật thẻ
exports.updateCard = async (id, data) => {
    return await Card.findByIdAndUpdate(id, data, { new: true });
};

// Xóa thẻ
exports.deleteCard = async (id) => {
    return await Card.findByIdAndDelete(id);
};

