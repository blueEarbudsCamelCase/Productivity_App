const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  streak: { type: Number, default: 0 },
  lastStreakChecked: { type: Date },
  tasks: [{
    label: String,
    completed: Boolean,
    dueDate: Date
  }]
});

module.exports = mongoose.model('User', userSchema);