const Card = require('../models/cards');
const { uploadImage } = require('./imageService');

// Tạo thẻ mới
exports.createCard = async (data, file) => {
  // Kiểm tra trùng tên
  const existingCard = await Card.findOne({ name: data.name });
  if (existingCard) {
    throw new Error("Thẻ với tên này đã tồn tại");
  }

  let imageUrl = null;
  if (file) {
    // Upload ảnh lên Cloudinary
    imageUrl = await uploadImage(file.buffer, "game-the-bai/cards");
  }

  // Chuẩn hóa skill (phải có name + description)
  let skills = [];
  if (data.skill) {
    try {
      // Nếu client gửi dạng JSON string
      if (typeof data.skill === "string") {
        skills = JSON.parse(data.skill);
      } else {
        skills = data.skill;
      }
    } catch (err) {
      throw new Error("Skill phải là array object [{ name, description }]");
    }
  }

  // Tạo thẻ mới theo model
  const card = new Card({
    ...data,

    skill: skills || [],

    imageUrl: imageUrl,

    parents: data.parents || []
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

// Lấy ảnh của thẻ
exports.getCardImageById = async (id) => {
  const card = await Card.findById(id).select('imageUrl');
  return card? card.imageUrl : null;
};

// Cập nhật thẻ
exports.updateCard = async (id, data, file) => {
  const card = await Card.findById(id);
  if (!card) {
    throw new Error("Không tìm thấy thẻ");
  }

  card.name = data.name || card.name;
  card.genCore = data.genCore ?? card.genCore;

  card.origin = data.origin || card.origin;
  card.feature = data.feature || card.feature;
  card.symbol = data.symbol || card.symbol;

  card.power = data.power ?? card.power;
  card.defense = data.defense ?? card.defense;
  card.magic = data.magic ?? card.magic;

  // Chuẩn hóa skill khi update
  if (data.skill) {
    try {
      if (typeof data.skill === "string") {
        card.skill = JSON.parse(data.skill);
      } else {
        card.skill = data.skill;
      }
    } catch (err) {
      throw new Error("Skill phải là array object [{ name, description }]");
    }
  }

  card.parents = data.parents || card.parents;

  if (file) {
    // Upload ảnh mới lên Cloudinary
    card.imageUrl = await uploadImage(file.buffer, "game-the-bai/cards");
  }

  return await card.save();
};

// Xóa thẻ
exports.deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};
