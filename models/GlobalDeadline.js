const mongoose = require('mongoose');

const globalDeadlineSchema = new mongoose.Schema({
  deadline: { type: Date, required: true }
});

const GlobalDeadline = mongoose.models.GlobalDeadline || mongoose.model('GlobalDeadline', globalDeadlineSchema);

module.exports = GlobalDeadline;
