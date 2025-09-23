const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryService = {
  /**
   * Upload ảnh từ buffer lên Cloudinary
   * @param {Buffer} buffer - Buffer của file ảnh
   * @param {string} folder - Thư mục trên Cloudinary
   * @returns {Promise<string>} - URL của ảnh đã upload
   */
  uploadFromBuffer: async (buffer, folder = 'game-the-bai') => {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: folder,
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  },

  /**
   * Upload ảnh từ file path lên Cloudinary
   * @param {string} filePath - Đường dẫn file ảnh
   * @param {string} folder - Thư mục trên Cloudinary
   * @returns {Promise<string>} - URL của ảnh đã upload
   */
  uploadFromFile: async (filePath, folder = 'game-the-bai') => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      // Xóa file tạm sau khi upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  },

  /**
   * Upload ảnh từ URL lên Cloudinary
   * @param {string} imageUrl - URL của ảnh cần upload
   * @param {string} folder - Thư mục trên Cloudinary
   * @returns {Promise<string>} - URL của ảnh đã upload
   */
  uploadFromUrl: async (imageUrl, folder = 'game-the-bai') => {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      return result.secure_url;
    } catch (error) {
      console.error('Error uploading URL to Cloudinary:', error);
      throw new Error('Failed to upload image from URL to Cloudinary');
    }
  },

  /**
   * Xóa ảnh từ Cloudinary
   * @param {string} publicId - Public ID của ảnh trên Cloudinary
   * @returns {Promise<Object>} - Kết quả xóa
   */
  deleteImage: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }
};

module.exports = cloudinaryService; 