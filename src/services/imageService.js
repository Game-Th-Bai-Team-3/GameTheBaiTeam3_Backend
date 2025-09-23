const cloudinary = require("../utils/cloudinaryConfig");

// Upload image to Cloudinary
const uploadImage = async (buffer ,folder ="GameTheBaiG3") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
    { folder  },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
stream.end(buffer);
  });
};
  
module.exports = {
  uploadImage,
};