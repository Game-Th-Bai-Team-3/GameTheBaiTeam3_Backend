const authService = require('../services/authService');
// Đăng ký
exports.register = async (req, res) => {
   try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
};

//xac thuc otp
exports.verifyOtp = async (req, res) => {
   try{
      const result = await authService.verifyOtp(req.body);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
}
//gửi lại otp
exports.resendOtp = async (req, res) => {
   try{
      const { email } = req.body;
      const result = await authService.resendOtp(email);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
}


// Đăng nhập
exports.login = async (req, res) => {
   try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   } 
};
// refresh token
exports.refreshToken = async (req, res) => {
   try{
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
}

// Thay đổi mật khẩu bằng mật khẩu hiện tại
exports.changePassword = async (req, res) => {
   try {
      const result = await authService.changePassword(req.body);
      res.status(200).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

// Tạo token đặt lại mật khẩu và gửi email
exports.forgotPassword = async (req, res) => {
   try {
      const result = await authService.forgotPassword(req.body);
      res.status(200).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

// Thay đổi mật khẩu bằng token
exports.resetPassword = async (req, res) => {
   try {
      const result = await authService.resetPassword(req.body);
      res.status(200).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

