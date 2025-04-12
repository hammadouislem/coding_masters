const mongoose = require('mongoose');

const globalDeadlineSchema = new mongoose.Schema({
  deadline: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('GlobalDeadline', globalDeadlineSchema);
