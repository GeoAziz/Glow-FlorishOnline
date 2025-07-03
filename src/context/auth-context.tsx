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
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

      if (firebaseUser) {
        // Keep loading true, do not set a partial user object yet.
        setLoading(true); 
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                // Doc exists, now we can build the complete user object
                const { role, ...rest } = doc.data();
                setUser({
                    ...firebaseUser,
                    role: role || 'user', // Default to 'user' if role is missing in doc
                    ...rest
                } as AppUser);
                setLoading(false); // ONLY now is loading complete.
            } else {
                // Doc doesn't exist yet (e.g., right after signup). 
                // We stay in a loading state and wait for the doc to be created.
                // Do not set user or set loading to false.
            }
        }, (error) => {
            console.error("Error listening to user document:", error);
            // On error, create a fallback user to unblock the UI.
            setUser({ ...firebaseUser, role: 'user' } as AppUser);
            setLoading(false);
        });

      } else {
        // User is logged out, not loading anymore.
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
