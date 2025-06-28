import admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountJson) {
    // This will stop the execution and provide a clear error in the logs
    // if the environment variable is not found.
    throw new Error(
      'CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. For local development, add it to the .env file. For production (e.g., Vercel), add it to your hosting environment variables.'
    );
  }

  try {
    // Attempt to parse and initialize the SDK
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    // This will catch errors from invalid JSON and provide a more helpful message.
    throw new Error(
      `CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it's a valid, unescaped JSON string. Original Error: ${error.message}`
    );
  }
}

const adminDb = admin.firestore();

export { adminDb };
