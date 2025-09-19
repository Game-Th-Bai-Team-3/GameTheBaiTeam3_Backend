const sharp = require('sharp');

exports.resizeImage = async (buffer, width = 400, height = 400) => {
  return await sharp(buffer)
    .resize(width, height, {
      fit: "inside", // không crop, giữ nguyên tỉ lệ
      withoutEnlargement: true, // ảnh nhỏ hơn thì giữ nguyên, không phóng to
    })
    .jpeg({ quality: 80 })
    .toBuffer();
};
