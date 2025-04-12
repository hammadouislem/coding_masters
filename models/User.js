const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['student', 'admin', 'incubator', 'cati', 'cde'],
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624f91abbe4a22f4a5b1f19"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "hashedpassword123"
 *         role:
 *           type: string
 *           enum: [student, admin, incubator, cati, cde]
 *           example: "student"
 */
