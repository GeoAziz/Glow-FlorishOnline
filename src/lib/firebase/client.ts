
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

// Universal check for required Firebase credentials.
const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
];

for (const key of requiredKeys) {
    if (!firebaseConfig[key]) {
        const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
        const errorMessage = `CRITICAL: Missing Firebase client config value for ${key}. Please set ${envVarName} in your environment.`;

        if (process.env.NODE_ENV !== 'production') {
            // For local development, throw a detailed error to stop the build.
            const detailedError = `
        
        --------------------------------------------------------------------
        !!! FIREBASE CLIENT SDK INITIALIZATION FAILED !!!
        ${errorMessage}
        Please create or check your .env.local file.
        --------------------------------------------------------------------
      
      `;
            throw new Error(detailedError);
        } else {
            // For production, log a critical error to the console.
            // Throwing an error here would crash the entire client-side app.
            console.error(errorMessage);
        }
    }
}


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics and get a reference to the service
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, auth, db, analytics };
