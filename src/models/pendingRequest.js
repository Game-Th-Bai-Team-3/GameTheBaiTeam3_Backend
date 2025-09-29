const mongoose = require('mongoose');

const pendingRequestSchema = new mongoose.Schema({
    requestId : { type: String, required: true, unique: true },
    cardIds : [{type: String, required: true}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date, default: Date.now, expires: '1h' } // Tự động xóa sau 1 giờ
});

module.exports = mongoose.model('PendingRequest', pendingRequestSchema);