const logger = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  logger.error(error.stack || error.message);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;