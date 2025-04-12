const createError = (statusCode, message) => {
  return new AppError(message, statusCode);
};

module.exports = createError;