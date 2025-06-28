import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

function initializeFirebaseAdmin() {
  // If already initialized, no need to do anything
  if (admin.apps.length > 0) {
    return;
  }

  // Method 1: Vercel/Production Environment
  // Check for the existence of Vercel-specific environment variables or the main private key.
  if (process.env.VERCEL || process.env.FIREBASE_PRIVATE_KEY) {
    console.log("Production environment detected. Initializing Firebase Admin SDK with environment variables.");
    
    // Ensure all required variables are present
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error(
        'CRITICAL: Missing Firebase Admin SDK environment variables. ' +
        'Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in your Vercel project settings.'
      );
    }
    
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          // Vercel escapes newlines, so we need to replace them back
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully for production.");
      return; // Success
    } catch (error: any) {
      // This will catch parsing errors if the credentials are malformed
      throw new Error(`CRITICAL: Failed to initialize Firebase from environment variables. Check their format. Error: ${error.message}`);
    }
  }

  // Method 2: Local Development Environment
  // Try to use the service-account-key.json file.
  try {
    console.log("Local environment detected. Attempting to initialize from service-account-key.json.");
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully from local file.");
      return; // Success
    }
  } catch (error: any) {
    console.error("Error initializing from local file, this might be expected if file is missing.", error);
  }

  // If both methods fail, throw a clear error.
  throw new Error(
    'CRITICAL: Firebase Admin SDK initialization failed. Could not find credentials. \n' +
    'For Production (Vercel): Ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set. \n' +
    'For Local Development: Ensure `service-account-key.json` exists in the project root.'
  );
}

// Initialize the app using our robust function
initializeFirebaseAdmin();

const adminDb = admin.firestore();
export { adminDb };
