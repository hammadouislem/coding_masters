class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor with the error message
    this.statusCode = statusCode || 500; // Default to 500 if no status code is provided
    this.isOperational = true; // Flag to distinguish operational errors (client errors, validation, etc.)
    Error.captureStackTrace(this, this.constructor); // Create a stack trace for debugging
  }
}

module.exports = AppError;
