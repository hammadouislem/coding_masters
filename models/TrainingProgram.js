const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
  file: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingProgram:
 *       type: object
 *       required:
 *         - file
 *         - assignedTo
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624e8acbbf0232c98d7a9b0"
 *         file:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               format: binary
 *               description: Binary PDF content
 *             contentType:
 *               type: string
 *               example: "application/pdf"
 *         assignedTo:
 *           type: array
 *           items:
 *             type: string
 *             description: User ID
 *             example: "661fe90bce20443705e37f1c"
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-12T15:20:30.000Z"
 */
