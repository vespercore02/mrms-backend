const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.UserID, {
      attributes: { exclude: ['Password'] },
      include: [Role],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User not found.',
      });
    }

    if (user.Status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. User account is not active.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Invalid or expired token.',
    });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const roleName = req.user?.Role?.RoleName;

    if (!roles.includes(roleName)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission.',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  allowRoles,
};