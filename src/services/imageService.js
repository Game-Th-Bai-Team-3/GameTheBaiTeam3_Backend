const sharp = require('sharp');

exports.resizeImage = async (buffer, width = 400, height = 400) => {
  return await sharp(buffer)
    .resize(width, height)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toBuffer();
};