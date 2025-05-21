const User = require('../models/user');

exports.getStreak = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ streak: 0 });
  res.json({ streak: user.streak, lastStreakChecked: user.lastStreakChecked });
};

exports.updateStreak = async (req, res) => {
  const { email, streak, lastStreakChecked } = req.body;
  let user = await User.findOne({ email });
  if (!user) user = new User({ email });
  user.streak = streak;
  user.lastStreakChecked = lastStreakChecked;
  await user.save();
  res.json({ success: true });
};