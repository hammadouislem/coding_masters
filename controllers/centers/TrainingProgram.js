const mongoose = require('mongoose');
const TrainingProgram = require('../../models/TrainingProgram');
const Project = require('../../models/project');
const CENTER_ROLES = ['incubator', 'cati', 'cde'];
/**
 * @swagger
 * tags:
 *   name: Center
 *   description: Operations related to center roles (incubator, cati, cde)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingProgram:
 *       type: object
 *       properties:
 *         assignedTo:
 *           type: array
 *           items:
 *             type: string
 *         file:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               format: binary
 *             contentType:
 *               type: string
 *     Project:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         status:
 *           type: string
 *         assignedTo:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

exports.uploadTrainingProgram = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const projects = await Project.find({ assignedTo: { $in: CENTER_ROLES } });

    if (!projects.length) {
      return res.status(404).json({ error: 'No users found for this center type.' });
    }

    const assignedArray = projects.map(project => project.assignedTo).flat();
    const uniqueAssignedUsers = [...new Set(assignedArray)];

    const trainingProgram = new TrainingProgram({
      assignedTo: uniqueAssignedUsers,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await trainingProgram.save();

    res.status(201).json({ message: 'Training program uploaded successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed.', details: err.message });
  }
};
