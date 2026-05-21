const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};