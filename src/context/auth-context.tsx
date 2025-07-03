
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
        // User is logged in, start loading their Firestore data
        setLoading(true);
        const userDocRef = doc(db, "users", firebaseUser.uid);

        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              // User document exists, we have the role.
              const userData = docSnapshot.data();
              setUser({
                ...(firebaseUser as AppUser), // Base user info from auth
                ...userData,                 // Add custom fields from Firestore
                role: userData.role || 'user', // Ensure role is set
              });
            } else {
              // This can happen briefly after signup before the user doc is created.
              // We create a temporary user object without a role. The listener will
              // fire again once the document is created.
              setUser({ ...firebaseUser, role: 'user' } as AppUser);
            }
            // Finished loading user data
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user document:", error);
            // On error, create a fallback user to unblock the UI.
            setUser({ ...firebaseUser, role: 'user' } as AppUser);
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
