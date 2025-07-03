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
      // Clean up the previous Firestore listener when the user changes
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

      if (firebaseUser) {
        setLoading(true); // Always start loading when a user is detected
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                // If the document exists, we have the role. Update user and stop loading.
                const { role, ...rest } = doc.data();
                setUser({
                    ...firebaseUser,
                    role: role || 'user',
                    ...rest
                } as AppUser);
                setLoading(false);
            }
            // If doc doesn't exist, we do nothing and wait. `loading` remains true.
            // onSnapshot will fire again once the document is created by the server action.
        }, (error) => {
            console.error("Error listening to user document:", error);
            // On error, default to user role and stop loading as a fallback.
            setUser({ ...firebaseUser, role: 'user' });
            setLoading(false);
        });

      } else {
        // User is logged out
        setUser(null);
        setLoading(false);
      }
    });

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
