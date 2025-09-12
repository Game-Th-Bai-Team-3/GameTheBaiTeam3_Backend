const authService = require('../services/authService');

exports.register = async (req, res) => {
   try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
};

exports.verifyOtp = async (req, res) => {
   try{
      const result = await authService.verifyOtp(req.body);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   }
}

exports.login = async (req, res) => {
   try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
   }catch (error) {
      res.status(400).json({ error: error.message });
   } 
};

exports.changePassword = async (req, res) => {
   try {
      const result = await authService.changePassword(req.body);
      res.status(200).json(result);
   } catch (error) {
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