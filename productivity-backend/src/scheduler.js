const cron = require('node-cron');
const User = require('./models/user');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

cron.schedule('0 0 * * *', async () => {
  const users = await User.find();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  for (const user of users) {
    // Find tasks due yesterday
    const incompleteYesterday = user.tasks.some(task => {
      const taskDue = new Date(task.dueDate);
      taskDue.setHours(0, 0, 0, 0);
      return (
        taskDue.getTime() === yesterday.getTime() &&
        !task.completed
      );
    });

    if (incompleteYesterday) {
      user.streak = 0;
      await user.save();
    }
  }
  console.log('Daily streak check complete');
});