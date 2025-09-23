const cloudinaryService = require('./cloudinaryService');

// Export function để tương thích với code cũ
const uploadImage = async (buffer, folder = 'GameTheBaiG3') => {
  try {
    return await cloudinaryService.uploadFromBuffer(buffer, folder);
  } catch (error) {
    throw new Error('Failed to upload image: ' + error.message);
  }
};

module.exports = {
  uploadImage
}; 