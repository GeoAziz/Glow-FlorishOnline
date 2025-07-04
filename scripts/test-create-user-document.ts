import * as admin from 'firebase-admin';
import { createUserDocument } from '../src/actions/user'; // Adjust the path if necessary

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  // Replace with your actual service account key path or configuration
  const serviceAccount = require('./path/to/your/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Replace with your databaseURL if needed
    // databaseURL: "https://your-database-name.firebaseio.com"
  });
}

// Hardcoded test values
const uid = 'test-user-uid-12345'; // Replace with a unique test UID
const email = 'testuser@example.com'; // Replace with a test email
const name = 'Test User'; // Optional: Replace with a test name or leave undefined

async function runCreateUserDocument() {
  console.log(`Attempting to create user document for UID: ${uid}, Email: ${email}${name ? `, Name: ${name}` : ''}`);
  try {
    // Pass the initialized admin.firestore() instance if needed by createUserDocument
    // (Assuming adminDb is initialized globally in src/lib/firebase/admin.ts which is imported)
    const result = await createUserDocument({ uid, email, name });

    if (result.success) {
      console.log('User document creation successful:', result.message);
    } else {
      console.error('User document creation failed:', result.error);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    // Depending on your setup, you might need to explicitly exit
    // process.exit(0);
  }
}

runCreateUserDocument();