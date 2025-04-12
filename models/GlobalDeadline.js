const mongoose = require('mongoose');

const globalDeadlineSchema = new mongoose.Schema({
  deadline: { type: Date, required: true }
});

const GlobalDeadline = mongoose.models.GlobalDeadline || mongoose.model('GlobalDeadline', globalDeadlineSchema);

module.exports = GlobalDeadline;
/**
 * @swagger
 * components:
 *   schemas:
 *     GlobalDeadline:
 *       type: object
 *       required:
 *         - deadline
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the global deadline.
 *           example: 642e4b3d3f1bfc001fd5e5a0
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: The deadline date and time.
 *           example: 2025-05-15T23:59:00.000Z
 */

