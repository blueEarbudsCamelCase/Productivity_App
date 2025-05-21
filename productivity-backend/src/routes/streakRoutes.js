const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

router.get('/:email', streakController.getStreak);
router.post('/update', streakController.updateStreak);

module.exports = router;