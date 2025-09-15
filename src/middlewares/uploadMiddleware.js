const multer = require('multer');

// Cấu hình lưu trữ tạm thời trong bộ nhớ
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Chỉ chấp nhận các định dạng ảnh
    if(
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ){
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận các định dạng ảnh: jpeg, jpg, png'), false);
    }
    
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;