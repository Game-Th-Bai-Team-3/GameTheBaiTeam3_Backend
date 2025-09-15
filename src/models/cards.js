const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },   // Tên thẻ
    genCore: { type: Number, required: true },// Gen Gốc %

    origin: { type: String, required: true }, // Nguồn gốc
    feature: { type: String, required: true },// Đặc trưng
    symbol: { type: String, required: true }, // Biểu tượng

    power: { type: Number, required: true },  // 🔪 Sức mạnh
    defense: { type: Number, required: true },// 🛡️ Phòng thủ
    magic: { type: Number, required: true },  // 🔮 Ma lực

    skill: [
        {
            name: { type: String, required: true },       // Tên chiêu thức
            description: { type: String, required: true } // Mô tả chiêu thức
        }
    ],

    image: {
        data: Buffer,         // dữ liệu binary (nếu bạn upload ảnh trực tiếp)
        contentType: String   // kiểu file (jpg/png)
    },

    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],

}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
