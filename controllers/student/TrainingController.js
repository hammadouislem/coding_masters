const User = require('../../models/User');
const TrainingProgram = require('../../models/TrainingProgram');
exports.getTrainingProgram = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const project = await Project.findOne({ createdBy: studentId });

    if (!project) {
      return res.status(404).json({ error: 'No project found for this user.' });
    }

    const trainingProgram = await TrainingProgram.findOne({ projectId: project._id });

    if (!trainingProgram) {
      return res.status(404).json({ error: 'Training program not available for this project.' });
    }

    if (!trainingProgram.isSubmitted) {
      return res.status(400).json({ error: 'The training program has not been submitted yet.' });
    }

    res.status(200).json({
      programDetails: trainingProgram.programDetails,
      trainingDates: trainingProgram.trainingDates,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve the training program.', details: err.message });
  }
};
