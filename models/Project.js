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
