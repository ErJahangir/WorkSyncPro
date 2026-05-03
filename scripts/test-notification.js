/**
 * Test script to send a push notification using Firebase Admin SDK
 * Usage: 
 * 1. npm install firebase-admin
 * 2. node scripts/test-notification.js <FCM_TOKEN>
 */

const admin = require('firebase-admin');
const serviceAccount = require('../worksyncpro-68dca-firebase-adminsdk-fbsvc-74a5c45ce7.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const registrationToken = process.argv[2];

if (!registrationToken) {
  console.error('❌ Please provide an FCM token as an argument');
  console.log('Usage: node scripts/test-notification.js YOUR_TOKEN_HERE');
  process.exit(1);
}

const message = {
  notification: {
    title: 'Test Notification ⚡',
    body: 'This is a test message from WorkSync Pro!'
  },
  data: {
    type: 'test',
    taskId: '123'
  },
  token: registrationToken
};

admin.messaging().send(message)
  .then((response) => {
    console.log('✅ Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('❌ Error sending message:', error);
  });
