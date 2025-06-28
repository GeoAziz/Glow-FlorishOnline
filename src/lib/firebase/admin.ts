
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  try {
    // Construct the absolute path to the service account key file
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');
    
    // Check if the file exists before trying to read it
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        'CRITICAL: `service-account-key.json` not found in the project root. Please ensure the file exists and is correctly named.'
      );
    }

    // Read and parse the service account key file
    const serviceAccountString = fs.readFileSync(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountString);

    // Initialize the Firebase Admin SDK with the credentials from the file
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

  } catch (error: any) {
    // Log the detailed error for debugging purposes
    console.error('CRITICAL: Failed to initialize Firebase Admin SDK.', error);
    
    // Throw a more user-friendly error to be displayed
    throw new Error(
      `CRITICAL: Failed to initialize Firebase Admin SDK. Please check your service-account-key.json file. Original Error: ${error.message}`
    );
  }
}

const adminDb = admin.firestore();

export { adminDb };
