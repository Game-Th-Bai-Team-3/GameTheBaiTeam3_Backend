const Card = require('../models/cards');
const { resizeImage } = require('./imageService');
// Tạo thẻ mới

exports.createCard = async (data,file) => {

// kiem tra trung ten 
    const existingCard = await Card.findOne({ name: data.name });
    if (existingCard) {
        throw new Error("Thẻ với tên này đã tồn tại");
    }

    let image = null;
    if (file) {
        // Resize ảnh trước khi lưu
        const resizedImageBuffer = await resizeImage(file.buffer);
        image = {
            data: resizedImageBuffer,
            contentType: "image/jpeg"
        };
    }

       

    
    // Lưu ảnh đã resize vao database
    const card = new Card({
        name: data.name,
        description: data.description,
        rarity: data.rarity || 'Common',
        species: data.species,
        element: data.element || 'Normal',
        stats: {
            attack: data.stats?.attack || 0,
            hp: data.stats?.hp || 0,
        },
        baseCards: data.baseCards || [],
        image: image

    });
    return await card.save();
};

// Lấy tất cả thẻ
exports.getAllCards = async () => {
    return await Card.find();
};
// Lấy thẻ theo ID
exports.getCardById = async (id) => {
    return await Card.findById(id);
};
//lấy ảnh
exports.getCardImageById = async (id) => {
    return await Card.findById(id).select('image');
};

// Cập nhật thẻ
exports.updateCard = async (id, data,file) => {
    const card = await Card.findById(id);
    if (!card) {
        throw new Error("Không tìm thấy thẻ");
    }
   card.name = data.name || card.name;
  card.description = data.description || card.description;
  card.rarity = data.rarity || card.rarity;
  card.species = data.species || card.species;
  card.element = data.element || card.element;
  card.stats = {
    attack: data.stats?.attack ?? card.stats.attack,
    hp: data.stats?.hp ?? card.stats.hp
  };
  card.baseCards = data.baseCards || card.baseCards;
  if(file){
    const resizedImageBuffer = await resizeImage(file.buffer);
    card.image = {
        data: resizedImageBuffer,
        contentType: "image/jpeg"
    };
  }
    return await card.save();
};

// Xóa thẻ
exports.deleteCard = async (id) => {
    return await Card.findByIdAndDelete(id);
};

