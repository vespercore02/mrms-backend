const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const login = async ({ Email, Password }) => {
  const user = await User.findOne({
    where: { Email },
    include: [Role],
  });

  if (!user) {
    return null;
  }

  if (user.Status !== 'active') {
    throw new Error('User account is not active');
  }

  const isPasswordValid = await bcrypt.compare(Password, user.Password);

  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      UserID: user.UserID,
      Email: user.Email,
      RoleID: user.RoleID,
      RoleName: user.Role?.RoleName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );

  const plainUser = user.toJSON();
  delete plainUser.Password;

  return {
    token,
    user: plainUser,
  };
};

module.exports = {
  login,
};