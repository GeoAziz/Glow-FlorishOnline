
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

function initializeFirebaseAdmin() {
  // If already initialized, no need to do anything
  if (admin.apps.length > 0) {
    return;
  }

  // Use environment variables in production (e.g., Vercel)
  if (process.env.NODE_ENV === 'production') {
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
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully for production.");
      return; // Success
    } catch (error: any) {
      throw new Error(`CRITICAL: Failed to initialize Firebase from environment variables. Check their format. Error: ${error.message}`);
    }
  }

  // Use local service account file in development
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');
    if (!fs.existsSync(serviceAccountPath)) {
        throw new Error("CRITICAL: `service-account-key.json` not found in the project root for local development.");
    }
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully from local file.");
  } catch (error: any) {
     throw new Error(`CRITICAL: Failed to initialize Firebase Admin SDK from local file. Error: ${error.message}`);
  }
}

initializeFirebaseAdmin();

const adminDb = admin.firestore();
export { adminDb };
