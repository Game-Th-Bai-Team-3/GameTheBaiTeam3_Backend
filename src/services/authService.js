const User = require("../models/userModel.js");
const OTP = require("../models/otp.js");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword,hashPassword } = require("../utils/bcrypt");
const otpGenerator = require('otp-generator');
const  sendOtp  = require("../utils/sendOtp");


// Đăng ký người dùng mới
exports.register = async ({username, email, password, role}) => {
    // Kiểm tra nếu email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Email đã tồn tại");
    }
    //tạo user chưa verify 

    const user = await User.create({ username, email, password, role, isVerified: false });

    // Tạo OTP
    const otp = otpGenerator.generate(6, 
        { upperCaseAlphabets: false, 
            specialChars: false,
             lowerCaseAlphabets: false });
    //xoa otp cu neu co
    await OTP.deleteMany({ email });


    // Lưu OTP vào database
    const hashedOtp = await hashPassword(otp);
    await OTP.create({
        email,
        otp: hashedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 phút
    });

    // Gửi OTP qua email
    await sendOtp(email, otp);

   return { message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực OTP" };
};

// kiem tra otp
exports.verifyOtp = async ({email, otp}) => {
    const otpRecord = await OTP.findOne({ email});
    if (!otpRecord) {
        throw new Error("OTP không hợp lệ hoặc đã dùng");
    }
    if (otpRecord.expiresAt < Date.now()) {
        throw new Error("OTP đã hết hạn");
    }
    const isValid = await comparePassword(otp, otpRecord.otp);
    if (!isValid) {
        throw new Error("OTP không đúng");
    }
    // Cập nhật trạng thái xác thực của người dùng
    await User.updateOne({ email }, {$set:{ isVerified: true }});

    //xóa OTP sau khi dùng 
      await OTP.deleteOne({ _id: otpRecord._id });
      
      return { message: "Xác thực thành công, bạn có thể đăng nhập" };
        
};

// Đăng nhập
exports.login = async ({email, password}) => {
    //kiem tra email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }
    //kiem tra verify
    if (!user.isVerified) {
        throw new Error("Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực OTP.");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    const token = generateToken(user._id, user.role);
    return { message: "Đăng nhập thành công", token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};