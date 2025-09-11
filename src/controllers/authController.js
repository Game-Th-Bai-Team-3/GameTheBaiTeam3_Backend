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


// Đăng nhập
exports.login = async (req, res) => {
   try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   } 
};

exports.forgotPassword = async (req, res) => {
   try {
      const result = await authService.forgotPassword(req.body);
      res.status(200).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

exports.resetPassword = async (req, res) => {
   try {
      const result = await authService.resetPassword(req.body);
      res.status(200).json(result);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

