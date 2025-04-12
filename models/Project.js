const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['saved', 'in progress', 'sent', 'assigned', 'rejected'],
    default: 'saved'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: [
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        studentId: String
      }
    ],
  },
  assignedTo: {
    type: String,
    enum: ['incubator', 'cati', 'cde', null],
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

// Avoid overwriting the model if it's already compiled
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

module.exports = Project;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectTeamMember:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Sara"
 *         last_name:
 *           type: string
 *           example: "Benali"
 *         email:
 *           type: string
 *           format: email
 *           example: "sara@example.com"
 *         phone:
 *           type: string
 *           example: "0667000000"
 *         studentId:
 *           type: string
 *           example: "123456"

 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - createdBy
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: "6624c503e7c13a14277ecdb2"
 *         title:
 *           type: string
 *           example: "Smart Water Management System"
 *         description:
 *           type: string
 *           example: "A system to monitor and optimize water usage using IoT sensors."
 *         status:
 *           type: string
 *           enum: [saved, in progress, sent, assigned, rejected]
 *           example: "in progress"
 *         createdBy:
 *           type: string
 *           description: User ID (MongoDB ObjectId)
 *           example: "6621fa7c8b74bc138ba93f30"
 *         team:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProjectTeamMember'
 *         assignedTo:
 *           type: string
 *           enum: [incubator, cati, cde, null]
 *           example: "cde"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-12T12:34:56.789Z"
 */
