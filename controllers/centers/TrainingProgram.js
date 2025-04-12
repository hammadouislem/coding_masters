const TrainingProgram = require('../../models/TrainingProgram');

exports.uploadTrainingProgram = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required.' });
    }

    const trainingProgram = new TrainingProgram({
      assignedTo,
      uploadedBy: req.user.userId,
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

