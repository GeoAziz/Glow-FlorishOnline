"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import type { AppUser, UserRole } from "@/types";

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        
        // Use onSnapshot to listen for real-time changes to the user's role
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const { role, ...rest } = doc.data();
                setUser({
                    ...firebaseUser,
                    role: role || 'user',
                    ...rest
                } as AppUser);
            } else {
                 // If doc doesn't exist yet, optimistically set role to 'user'
                 setUser({ ...firebaseUser, role: 'user' });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to user document:", error);
            // Fallback for safety
            setUser({ ...firebaseUser, role: 'user' });
            setLoading(false);
        });

        // Return the firestore unsubscribe function to be called on cleanup
        return unsubscribeFirestore;
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
         <div className="w-full h-screen flex items-center justify-center">
             <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background" />
         </div>
      ) : children }
    </AuthContext.Provider>
  );
};
