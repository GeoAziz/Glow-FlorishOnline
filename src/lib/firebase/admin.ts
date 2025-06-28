import admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
  } = process.env;

  if (
    !FIREBASE_PROJECT_ID ||
    !FIREBASE_PRIVATE_KEY ||
    !FIREBASE_CLIENT_EMAIL
  ) {
    throw new Error(
      'CRITICAL: Missing Firebase Admin SDK credentials. Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set in your .env file for local development or in your hosting environment variables for production.'
    );
  }

  try {
    // Construct the service account object from individual environment variables
    const serviceAccount = {
      projectId: FIREBASE_PROJECT_ID,
      // The private key from the .env file has its newlines escaped. We need to un-escape them.
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    throw new Error(
      `CRITICAL: Failed to initialize Firebase Admin SDK. Check your environment variables. Original Error: ${error.message}`
    );
  }
}

const adminDb = admin.firestore();

export { adminDb };
