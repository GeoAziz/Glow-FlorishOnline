
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
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    const missingVars = [];
    if (!projectId) missingVars.push('FIREBASE_PROJECT_ID');
    if (!privateKey) missingVars.push('FIREBASE_PRIVATE_KEY');
    if (!clientEmail) missingVars.push('FIREBASE_CLIENT_EMAIL');

    if (missingVars.length > 0) {
      console.error('--------------------------------------------------------------------');
      console.error('!!! FIREBASE ADMIN SDK INITIALIZATION FAILED IN PRODUCTION !!!');
      console.error('CRITICAL: The following server-side environment variables are missing in your Vercel project settings:');
      console.error(`- ${missingVars.join('\n- ')}`);
      console.error('\nPlease go to your Vercel project > Settings > Environment Variables and add them.');
      console.error('---');
      console.error('Current Status:');
      console.error(`- Found FIREBASE_PROJECT_ID: ${!!projectId}`);
      console.error(`- Found FIREBASE_PRIVATE_KEY: ${!!privateKey}`);
      console.error(`- Found FIREBASE_CLIENT_EMAIL: ${!!clientEmail}`);
      console.error('--------------------------------------------------------------------');
      throw new Error(`Missing critical Firebase Admin environment variables: ${missingVars.join(', ')}.`);
    }
    
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          // Vercel escapes newlines, so we need to replace them back
          privateKey: (privateKey || '').replace(/\\n/g, '\n'),
          clientEmail: clientEmail,
        }),
      });
      console.log("[Admin SDK] Initialized successfully for production.");
      return; // Success
    } catch (error: any) {
      throw new Error(`CRITICAL: Failed to initialize Firebase from environment variables. Check their format. Error: ${error.message}`);
    }
  }

  // Use local service account file in development
  const serviceAccountPath = path.resolve(process.cwd(), 'service-account-key.json');
  console.log(`[Admin SDK] Looking for service account key at: ${serviceAccountPath}`);

  if (!fs.existsSync(serviceAccountPath)) {
    console.error('--------------------------------------------------------------------');
    console.error('!!! FIREBASE ADMIN SDK INITIALIZATION FAILED !!!');
    console.error('CRITICAL: `service-account-key.json` not found for local development.');
    console.error('Please download it from your Firebase project settings (Service Accounts > Generate new private key)');
    console.error('and place it in the root directory of your project.');
    console.error('--------------------------------------------------------------------');
    throw new Error('Missing service-account-key.json');
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("[Admin SDK] Initialized successfully from local file.");
  } catch (error: any) {
     console.error('--------------------------------------------------------------------');
     console.error('!!! FIREBASE ADMIN SDK INITIALIZATION FAILED !!!');
     console.error('CRITICAL: Failed to parse `service-account-key.json` or initialize the app.');
     console.error('Please ensure the file is a valid JSON downloaded from Firebase.');
     console.error(`Error details: ${error.message}`);
     console.error('--------------------------------------------------------------------');
     throw new Error(`Invalid service-account-key.json: ${error.message}`);
  }
}

initializeFirebaseAdmin();

const adminDb = admin.firestore();
export { adminDb };
