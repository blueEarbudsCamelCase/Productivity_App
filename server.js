const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Replace with your own VAPID keys
const publicVapidKey = 'BBH5938c6QK4fyh3hLgv49I_bcHuVwF0_Ktkg_Z2A1jCjmp0Z94t3JkJp2xx-SrwIRJ4s6cvGLRs6nrvBqWQkNg';
const privateVapidKey = 'gjcQlFa_CcM76QRSQS5yQCaYYHXR1_RLUjDWgjJ-Wrk';

webpush.setVapidDetails(
  'mailto:your@email.com',
  publicVapidKey,
  privateVapidKey
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

let subscriptions = [];

// Save subscription
app.post('/save-subscription', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription saved.' });
});

// Send a test notification to all subscribers
app.get('/send-notification', async (req, res) => {
  const notificationPayload = {
    title: 'Test Notification',
    body: 'This is a test push notification!',
  };

  const sendPromises = subscriptions.map(sub =>
    webpush.sendNotification(sub, JSON.stringify(notificationPayload)).catch(err => {
      // Remove invalid subscriptions
      subscriptions = subscriptions.filter(s => s !== sub);
    })
  );

  await Promise.all(sendPromises);
  res.json({ message: 'Notifications sent.' });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});