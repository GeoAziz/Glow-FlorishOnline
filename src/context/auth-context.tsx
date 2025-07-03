
"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import type { AppUser } from "@/types";

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // If a user logs out, unsubscribe from any existing Firestore listener
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

      if (firebaseUser) {
        setLoading(true);
        const userDocRef = doc(db, "users", firebaseUser.uid);

        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              // User document exists, we have the role.
              // This is the definitive point where we can confirm the user's identity and role.
              const userData = docSnapshot.data();
              setUser({
                ...(firebaseUser as AppUser), // Base user info from auth
                ...userData,                 // Add custom fields from Firestore
                role: userData.role || 'user', // Ensure role is set
              });
              setLoading(false); // Only stop loading once we have the role data.
            }
            // If the document doesn't exist yet (e.g., right after signup),
            // we intentionally do nothing. We keep `loading` as `true` and wait for
            // the `createUserDocument` action to complete, which will trigger this
            // `onSnapshot` listener again with the created document.
          },
          (error) => {
            console.error("Error fetching user document:", error);
            // On error, log out the user to prevent an inconsistent state.
            setUser(null);
            setLoading(false);
          }
        );
      } else {
        // User is logged out
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
