import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check for missing environment variables during development
if (process.env.NODE_ENV !== 'production') {
    const requiredKeys: (keyof typeof firebaseConfig)[] = [
        'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
    ];

    for (const key of requiredKeys) {
        if (!firebaseConfig[key]) {
            const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
            const errorMessage = `
        
        --------------------------------------------------------------------
        !!! FIREBASE CLIENT SDK INITIALIZATION FAILED !!!
        CRITICAL: Missing environment variable ${envVarName}.
        Please create a .env.local file in the root of your project
        and add all the necessary Firebase credentials.
        You can copy the contents of .env.example to get started.
        Find your credentials in your Firebase project settings.
        --------------------------------------------------------------------
      
      `;
            throw new Error(errorMessage);
        }
    }
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, auth, db, analytics };
