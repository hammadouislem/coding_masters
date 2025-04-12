const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['student', 'admin', 'incubator', 'cati', 'cde'],
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);
