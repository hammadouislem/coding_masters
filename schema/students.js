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
    .isArray().withMessage("Team must be an array"),

  // Validate each team member's fields
  body("team.*.first_name")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string"),

  body("team.*.last_name")
    .notEmpty().withMessage("Last name is required")
    .isString().withMessage("Last name must be a string"),

  body("team.*.email")
    .isEmail().withMessage("Invalid email"),

  body("team.*.phone_number")
    .notEmpty().withMessage("Phone number is required")
    .isString().withMessage("Phone number must be a string"),

  body("team.*.speciality")
    .notEmpty().withMessage("Speciality is required")
    .isString().withMessage("Speciality must be a string"),

  body("team.*.student_id")
    .notEmpty().withMessage("Student ID is required")
    .isString().withMessage("Student ID must be a string"),

  body("team.*.year_of_inscription")
    .notEmpty().withMessage("Year of inscription is required")
    .isInt({ min: 2010, max: 2100 }).withMessage("Year must be a valid number"),
];
// Validation for project update
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

// Validation for project submission
const validateProjectSubmission = [
  param("projectId")
    .notEmpty().withMessage("Project ID is required")
    .isMongoId().withMessage("Invalid Project ID format")
];

module.exports = {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectSubmission
};
