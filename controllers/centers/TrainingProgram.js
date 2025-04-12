const mongoose = require('mongoose');
const TrainingProgram = require('../../models/TrainingProgram');
const Project = require('../../models/Project');  // assuming Project model is where center assignments are stored
const CENTER_ROLES = ['incubator', 'cati', 'cde'];

exports.uploadTrainingProgram = async (req, res) => {
  try {
    const role = req.user.role;

    if (!CENTER_ROLES.includes(role)) {
      return res.status(403).json({ error: 'Access denied. Not a center role.' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    const projects = await Project.find({ assignedTo: role }); // Assuming 'assignedTo' in Project contains users assigned to a center

    if (!projects.length) {
      return res.status(404).json({ error: 'No users found for this center type.' });
    }

    // Extract the user IDs assigned to this center type (from the projects)
    const assignedArray = projects.map(project => project.assignedTo).flat(); // Flatten in case there are multiple users per project

    // Remove duplicates, if any
    const uniqueAssignedUsers = [...new Set(assignedArray)];

    // Create a new training program object and assign the users
    const trainingProgram = new TrainingProgram({
      assignedTo: uniqueAssignedUsers,
      uploadedBy: req.user.userId,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    // Save the new training program to the database
    await trainingProgram.save();

    res.status(201).json({ message: 'Training program uploaded successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed.', details: err.message });
  }
};
