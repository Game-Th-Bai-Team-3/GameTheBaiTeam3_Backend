const User = require("../models/userModel.js");
const OTP = require("../models/otp.js");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword, hashPassword } = require("../utils/bcrypt");
const crypto = require("crypto");
const otpGenerator = require('otp-generator');

// Đăng ký người dùng mới
exports.register = async ({ username, email, password, role }) => {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new Error("Email đã tồn tại");
    }

    // Tạo OTP 6 số
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
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Tạo user (chưa xác thực)
    await User.create({ username, email, password, role, isVerified: false });

    // Dev-friendly: trả OTP trong response để dễ test (có thể bỏ khi production)
    return { message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực OTP", devOtp: otp };
};

// Xác thực OTP
exports.verifyOtp = async ({ email, otp }) => {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
        throw new Error("OTP không hợp lệ hoặc đã dùng");
    }
    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new Error("OTP đã hết hạn");
    }
    const isValid = await comparePassword(otp, otpRecord.otp);
    if (!isValid) {
        throw new Error("OTP không đúng");
    }

    await User.updateOne({ email }, { $set: { isVerified: true } });
    await OTP.deleteOne({ _id: otpRecord._id });
    return { message: "Xác thực thành công, bạn có thể đăng nhập" };
};

// Đăng nhập
exports.login = async ({email, password}) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }
    if (!user.isVerified) {
        throw new Error("Tài khoản chưa xác thực OTP");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    const token = generateToken(user._id, user.role);
    return { message: "Đăng nhập thành công", token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

// Đổi mật khẩu với mật khẩu hiện tại
exports.changePassword = async ({ email, currentPassword, newPassword }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại");
    }
    if (!user.isVerified) {
        throw new Error("Tài khoản chưa xác thực OTP");
    }
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
    }
    user.password = newPassword; // sẽ được hash bởi pre-save
    await user.save();
    return { message: "Thay đổi mật khẩu thành công" };
};

// Quên mật khẩu - tạo reset token (dev-friendly: trả token để test)
exports.forgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại trong hệ thống");
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    return { message: "Tạo token đặt lại mật khẩu thành công", devResetToken: resetToken, expiry: resetTokenExpiry };
};

// Đặt lại mật khẩu bằng token
exports.resetPassword = async ({ token, newPassword }) => {
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }
    });
    if (!user) {
        throw new Error("Reset token không hợp lệ hoặc đã hết hạn");
    }
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return { message: "Đặt lại mật khẩu thành công" };
};