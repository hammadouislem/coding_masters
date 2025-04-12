const winston = require('winston');

// Create a logger instance with Console and File transports
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' })
  ]
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Express-validator error handling
  if (Array.isArray(err?.errors) && err?.location) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map(e => e.msg),
    });
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Database Validation Error',
      error: err.errors.map(e => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Unique Constraint Error',
      error: err.message,
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Foreign Key Constraint Error',
      error: err.message,
    });
  }

  // Log unexpected errors
  logger.error("Unexpected Error", {
    message: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const responsePayload = {
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  };

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
