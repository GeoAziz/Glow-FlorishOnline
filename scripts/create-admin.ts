
// Usage: npx tsx scripts/create-admin.ts <email> <password>
import admin from 'firebase-admin';
import { adminDb } from '../src/lib/firebase/admin'; // This will trigger initializeFirebaseAdmin()

async function createAdminUser(email: string, password: string) {
  console.log(`Attempting to create admin user: ${email}...`);

  if (!email || !password || password.length < 6) {
    console.error('Error: Please provide a valid email and a password of at least 6 characters.');
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password>');
    process.exit(1);
  }

  try {
    // Step 1: Create the user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: 'Admin',
    });
    console.log('Successfully created new user in Firebase Auth with uid:', userRecord.uid);

    // Step 2: Create the user document in Firestore with the 'admin' role
    const userRef = adminDb.collection('users').doc(userRecord.uid);
    await userRef.set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('Successfully created user document in Firestore with admin role.');
    console.log('✅ Admin user created successfully!');
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Error creating admin user:');
    if (error.code === 'auth/email-already-exists') {
      console.error('   The email address is already in use by another account. Please delete it from Firebase Authentication and try again.');
    } else {
      console.error('   ' + error.message);
    }
    process.exit(1);
  }
}

const [,, email, password] = process.argv;
createAdminUser(email, password);
