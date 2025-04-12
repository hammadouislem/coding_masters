const { body, param } = require("express-validator");

const validateProjectCreation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .notEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description must be at most 500 characters"),

  body("team")
    .isArray().withMessage("Team must be an array")
    .isLength({ min: 1, max: 6 }).withMessage("Team size must be between 1 and 6 members"),

  body("deadline")
    .optional()
    .isISO8601().withMessage("Deadline must be a valid date in ISO8601 format")
    .toDate()
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    })
];

const validateProjectUpdate = [
  body("title")
    .optional()
    .isString().withMessage("Title must be a string")
    .isLength({ min: 2, max: 100 }).withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description must be at most 500 characters"),

  body("team")
    .optional()
    .isArray().withMessage("Team must be an array")
    .isLength({ min: 1, max: 6 }).withMessage("Team size must be between 1 and 6 members"),

  body("deadline")
    .optional()
    .isISO8601().withMessage("Deadline must be a valid date in ISO8601 format")
    .toDate()
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    })
];

const validateProjectSubmission = [
  body("projectId")
    .notEmpty().withMessage("Project ID is required")
    .isMongoId().withMessage("Invalid Project ID format")
];

module.exports = {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectSubmission
};
