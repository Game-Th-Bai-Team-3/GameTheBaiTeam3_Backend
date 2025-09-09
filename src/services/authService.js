const User = require("../models/userModel.js");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword } = require("../utils/bcrypt");

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