const mongoose = require('mongoose');

const imageHistorySchema = new mongoose.Schema({
  requestId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  originalCards: [{
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    rarity: { type: String },
    element: { type: String }
  }],
  generatedImage: {
    url: { type: String, required: true },
    publicId: { type: String },
    cloudinaryId: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingTime: { type: Number }, // milliseconds
  aiResponse: {
    type: mongoose.Schema.Types.Mixed // Lưu response từ AI
  },
  metadata: {
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    description: { type: String },
    tags: [{ type: String }]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Có thể không cần user nếu không có authentication
  }
}, { 
  timestamps: true 
});

// Index để tìm kiếm nhanh
imageHistorySchema.index({ 'metadata.createdAt': -1 });
imageHistorySchema.index({ status: 1 });

module.exports = mongoose.model('ImageHistory', imageHistorySchema);
