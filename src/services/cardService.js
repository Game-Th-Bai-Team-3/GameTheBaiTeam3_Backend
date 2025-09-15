const Card = require('../models/cards');
const { resizeImage } = require('./imageService');

// Tạo thẻ mới
exports.createCard = async (data, file) => {
  // Kiểm tra trùng tên
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
      contentType: file.mimetype || "image/jpeg"
    };
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
    name: data.name,
    genCore: data.genCore,

    origin: data.origin,
    feature: data.feature,
    symbol: data.symbol,

    power: data.power,
    defense: data.defense,
    magic: data.magic,

    skill: skills || [],

    image: image,

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
  return await Card.findById(id).select('image');
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
    const resizedImageBuffer = await resizeImage(file.buffer);
    card.image = {
      data: resizedImageBuffer,
      contentType: file.mimetype || "image/jpeg"
    };
  }

  return await card.save();
};

// Xóa thẻ
exports.deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};
