import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = require('../../../service-account-key.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch(error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    // In a production environment, you would use environment variables
    // For example:
    // admin.initializeApp({
    //   credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    // });
  }
}

const adminDb = admin.firestore();

export { adminDb };
