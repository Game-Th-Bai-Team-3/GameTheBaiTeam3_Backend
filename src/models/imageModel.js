const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  originalImage1: {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  originalImage2: {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  processedImage: {
    url: { type: String },
    publicId: { type: String }
  },
  status: {
    type: String,
    enum: ["uploaded", "processing", "completed", "failed"],
    default: "uploaded"
  },
  socketId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

imageSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Image", imageSchema);
