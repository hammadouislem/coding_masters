const { ValidationError } = require('express-validator');
const winston = require('winston');

// Create a logger instance with different transports (Console and File)
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // log to the console
    new winston.transports.File({ filename: 'error.log' }) // log to a file
  ]
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // ValidationError from express-validator
  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors.map(e => e.msg),
    });
  }

  // Handling Sequelize database errors
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

  // Handle other types of errors
  logger.error("Unexpected Error:", { message: err.message, stack: err.stack });

  // Determine status code and response format
  const statusCode = err.statusCode || 500;
  const responsePayload = {
    message: statusCode === 500 ? "Internal Server Error" : err.message
  };

  // Include stack trace in development mode for debugging purposes
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  // Return the error response
  return res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;
