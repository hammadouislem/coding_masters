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
