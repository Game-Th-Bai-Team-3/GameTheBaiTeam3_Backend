const User = require("../models/userModel.js");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword, hashPassword } = require("../utils/bcrypt");
const { sendResetPasswordEmail } = require("./emailService");
const crypto = require("crypto");

// Đăng ký người dùng mới
exports.register = async ({username, email, password, role}) => {
    // Kiểm tra nếu email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Email đã tồn tại");
    }
    const user = await User.create({ username, email, password, role });
    return { message: "Đăng ký thành công", user };
};

// Đăng nhập
exports.login = async ({email, password}) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    const token = generateToken(user._id, user.role);
    return { message: "Đăng nhập thành công", token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
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