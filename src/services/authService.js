const User = require("../models/userModel.js");
const OTP = require("../models/otp.js");
const { generateTokenPair  } = require("../utils/jwtToken");
const { comparePassword, hashPassword } = require("../utils/bcrypt");
const { sendResetPasswordEmail } = require("./emailService");
const crypto = require("crypto");
const otpGenerator = require('otp-generator');
//const  sendOtp  = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendgridMailer");

// Đăng ký người dùng mới
exports.register = async ({ username, email, password, role }) => {
    // Kiểm tra nếu email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Email đã tồn tại");
    }

    // Tạo OTP
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });

    // Xóa OTP cũ nếu có
    await OTP.deleteMany({ email });

    // Hash OTP và lưu vào DB
    const hashedOtp = await hashPassword(otp);
    await OTP.create({
        email,
        otp: hashedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 phút
    });

    // Thử gửi OTP qua email
    try {
        await sendOtpEmail(email, otp);
    } catch (err) {
        // Nếu gửi thất bại thì xóa OTP
        await OTP.deleteMany({ email });
        throw new Error("Không thể gửi OTP. Vui lòng thử lại sau.");
    }

    // Nếu gửi OTP ok thì mới tạo user
    const user = await User.create({
        username,
        email,
        password,
        role,
        isVerified: false
    });

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

//gửi lại OTP
exports.resendOtp = async (email) => {
    //kiểm tra email có tồn tại không và chưa xác thực
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }
    if(user.isVerified){
        throw new Error("Tài khoản đã được xác thực. Bạn đã có thể đăng nhập.");
    }
    // xóa OTP cũ nếu có
    await OTP.deleteMany({ email });
    // Tạo OTP mới
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
    // Hash OTP và lưu vào DB
    const hashedOtp = await hashPassword(otp);
    await OTP.create({
        email,
        otp: hashedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 phút
    });
    // Thử gửi OTP qua email
    try {
        await sendOtpEmail(email, otp);
        return { message: "OTP mới đã được gửi thành công. Vui lòng kiểm tra email của bạn." };
    } catch (err) {
        // Nếu gửi thất bại thì xóa OTP
        await OTP.deleteMany({ email });
        throw new Error("Không thể gửi OTP. Vui lòng thử lại sau.");
    }
}

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
    //kiem tra password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    // Tạo cặp access & refresh token
    const { accessToken, refreshToken } = generateTokenPair(user);
    //lưu refreshToken vào db
    user.refreshToken = refreshToken;
    await user.save();
    // Trả về token và thông tin người dùng (không bao gồm mật khẩu)
    return { message: "Đăng nhập thành công", 
        accessToken,
        refreshToken,
         user: { id: user._id,
             username: user.username,
              email: user.email, 
              role: user.role }, };
};
// refresh token
exports.refreshToken = async (refreshToken) => {
    //kiem tra refreshToken
    if(!refreshToken){
        throw new Error("Refresh token không hợp lệ");
    }
    //tim user có token này trong db
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error("Refresh token không hợp lệ");
    }
    // verify token
    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        //tao cặp token mới
        const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);
        //lưu refreshToken mới vào db
        user.refreshToken = newRefreshToken;
        await user.save();
        //trả về token mới
        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }catch(err){
        throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
    }
};

// Cập nhật mật khẩu bằng mật khẩu hiện tại
exports.changePassword = async ({ email, currentPassword, newPassword }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }

    // Mật khẩu mới sẽ được hash tự động bởi middleware
    user.password = newPassword;
    await user.save();

    return { message: "Thay đổi mật khẩu thành công" };
};
// Quên mật khẩu - gửi email reset password
exports.forgotPassword = async ({ email }) => {
    console.log('🔍 [DEBUG] Checking email:', email);
    const user = await User.findOne({ email });
    console.log('🔍 [DEBUG] User found:', user ? 'YES' : 'NO');
    if (!user) {
        throw new Error("Email không tồn tại trong hệ thống");
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // Lưu token vào database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Gửi email reset password
    try {
        console.log('📧 [DEBUG] Sending email to:', email, 'with token:', resetToken);
        const emailResult = await sendResetPasswordEmail(email, user.username, resetToken);
        console.log('✅ [DEBUG] Email sent successfully:', emailResult);
        
        return { 
            message: "Email reset mật khẩu đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn.",
            email: email,
            expiry: resetTokenExpiry
        };
    } catch (emailError) {
        // Nếu gửi email thất bại, xóa token đã tạo
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        
        throw new Error("Không thể gửi email reset mật khẩu. Vui lòng thử lại sau.");
    }
};

// Reset mật khẩu
exports.resetPassword = async ({ token, newPassword }) => {
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() } // Token chưa hết hạn
    });

    if (!user) {
        throw new Error("Reset token không hợp lệ hoặc đã hết hạn");
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword; // Sẽ được hash tự động bởi pre-save middleware
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return { message: "Đặt lại mật khẩu thành công" };
};