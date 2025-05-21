require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const streakRoutes = require('./routes/streakRoutes');
require('./scheduler'); // Import the scheduler

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/streak', streakRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(4000, () => console.log('Backend running on port 4000'));
  })
  .catch(err => console.error(err));