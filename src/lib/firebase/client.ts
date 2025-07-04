
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This function will either return the initialized app or throw a clear error.
function initializeFirebaseApp() {
  const missingKeys: string[] = [];
  // These keys are absolutely essential for Firebase to work.
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId'
  ];

  for (const key of requiredKeys) {
      if (!firebaseConfig[key]) {
          const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
          missingKeys.push(envVarName);
      }
  }

  if (missingKeys.length > 0) {
    // This error will be thrown, making the configuration problem impossible to miss.
    const errorMessage = `
    
    --------------------------------------------------------------------
    !!! FIREBASE CLIENT SDK INITIALIZATION FAILED !!!
    CRITICAL: The following required environment variables are missing:
    - ${missingKeys.join('\n- ')}

    Please go to your Vercel project > Settings > Environment Variables
    and ensure all NEXT_PUBLIC_ variables are set correctly.
    --------------------------------------------------------------------
  
  `;
    throw new Error(errorMessage);
  }

  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Promise<Analytics | null>;

try {
  // We only attempt to initialize Firebase in the browser.
  if (typeof window !== 'undefined') {
    app = initializeFirebaseApp();
    auth = getAuth(app);
    db = getFirestore(app);
    analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
  }
} catch (error) {
  // The error from initializeFirebaseApp is caught here and logged.
  // The app will not have Firebase services available, and subsequent calls will fail.
  console.error(error);
}

// @ts-ignore - These are initialized conditionally based on the environment.
export { app, auth, db, analytics };
